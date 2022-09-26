import { Donation } from '@cp/common'
import {
	blueStarKey,
	donationAlertKey,
	donationAlertWithMessageKey,
	FIREWORKS_SOUND_1_AUDIO_KEY,
	FIREWORKS_SOUND_2_AUDIO_KEY,
	STAR_RAIN_SOUND_AUDIO_KEY,
	TTS_KEY,
} from '../../scenes/OverlayScene'
import { Star } from '../Star'
import { DonationAlertBanner } from '../containers/donationBanner/DonationBanner'
import {
	DonationBannerContainer,
	donationAlertContainerName,
} from '../containers/donationBanner/DonationBannerContainer'
import { DonationBannerHeaderText } from '../containers/donationBanner/DonationBannerHeaderText'
import { DonationBannerMessageText } from '../containers/donationBanner/DonationBannerMessageText'
import { Alert } from '../containers/alert/Alert'
import {
	ALERT_FIREWORKS_MIN_AMOUNT,
	ALERT_STAR_AND_FIREWORK_MIN_AMOUNT,
	ALERT_STAR_RAIN_MIN_AMOUNT,
} from '../containers/donationBanner/donationSpecialEffectsConfig'
import { formatDonationAlertCurrenty } from '../../../../../lib/utils'
const { FloatBetween } = Phaser.Math

export class DonationBehaviour {
	public ttsMinDonationAmount

	/**
	 * Checky every second if the queue has items and try
	 * start donation animation.
	 */
	private checkQueueTimerId: undefined | number
	private checkQueueTimer = 500
	private alert: Alert
	private queue
	private starGroup
	private starFollowParticle
	private fireworksEmitter

	constructor(
		alert: Alert,
		queue: Donation[],
		starGroup: Phaser.GameObjects.Group,
		starFollowParticle: Phaser.GameObjects.Particles.ParticleEmitterManager,
		fireworksEmitter: Phaser.GameObjects.Particles.ParticleEmitter,
		ttsMinDonationAmount: number
	) {
		this.alert = alert
		this.queue = queue
		this.starGroup = starGroup
		this.starFollowParticle = starFollowParticle
		this.fireworksEmitter = fireworksEmitter
		this.ttsMinDonationAmount = ttsMinDonationAmount
		this.startListenForDonations()
	}

	private startListenForDonations() {
		this.checkQueueTimerId = window.setInterval(() => {
			const isSpeaking = this.alert.scene.sound.get(TTS_KEY) ? this.alert.scene.sound.get(TTS_KEY).isPlaying : false
			const isReadyToPlayNextDonation = this.queue.length > 0 && !isSpeaking && !this.isCurrentyBannerShowing()
			if (isReadyToPlayNextDonation) {
				this.triggerAlert(this.queue.shift()!)
			}
		}, this.checkQueueTimer)
	}

	private isCurrentyBannerShowing() {
		const donationAlertContainer = this.alert.scene.children.getByName(
			donationAlertContainerName
		) as DonationBannerContainer
		const bannerWithMessage = donationAlertContainer.getByName(donationAlertWithMessageKey) as DonationAlertBanner
		const bannerWithoutMessage = donationAlertContainer.getByName(donationAlertKey) as DonationAlertBanner

		return bannerWithoutMessage.isPlaying() || bannerWithMessage.isPlaying()
	}

	private createTextElements(donation: Donation) {
		const donationAlertContainer = this.alert.scene.children.getByName(
			donationAlertContainerName
		) as DonationBannerContainer
		const donationAlert = donation.message
			? (donationAlertContainer.getByName(donationAlertWithMessageKey) as DonationAlertBanner)
			: (donationAlertContainer.getByName(donationAlertKey) as DonationAlertBanner)

		this.createDonationAlertHeaderText(donation, donationAlert, donationAlertContainer)

		// only create userMessageText object if message is given
		if (donation.message) {
			this.createDonationAlertUserMessageText(donation, donationAlert, donationAlertContainer)
		}
		donationAlert.alpha = 1
	}

	private createDonationAlertHeaderText = (
		donation: Donation,
		donationAlert: DonationAlertBanner,
		donationAlertContainer: DonationBannerContainer
	) => {
		const formatedDonationAmount = formatDonationAlertCurrenty(donation.net_amount)
		const donationAlertHeaderText = new DonationBannerHeaderText(
			this.alert.scene,
			0,
			donationAlert.displayHeight - 240 * donationAlertContainer.scale,
			`${donation.user} spendet ${formatedDonationAmount}`,
			donationAlert.scale
		)
		donationAlertContainer.add(donationAlertHeaderText)
	}

	private createDonationAlertUserMessageText = (
		donation: Donation,
		donationAlert: DonationAlertBanner,
		donationAlertContainer: DonationBannerContainer
	) => {
		const donationAlertUserMessageText = new DonationBannerMessageText(
			this.alert.scene,
			donationAlert.x - (donationAlert.displayWidth / 2 - 50),
			donationAlert.displayHeight - 540 * donationAlertContainer.scale,
			donation.message,
			donationAlert.scale,
			donationAlert.displayWidth - 70 * donationAlertContainer.scale * 2
		)
		donationAlertContainer.add(donationAlertUserMessageText)
	}

	private triggerAlert(donation: Donation) {
		this.alert.scene.events.emit('triggerTtsProcessing', donation)
		this.alert.scene.events.once('donationTrigger', (donation2: Donation) => {
			// default behaviour
			this.createBanner(donation2)
			this.createTextElements(donation2)

			// amount based effects
			this.createVisualEffects(donation2.net_amount)

			if (donation2.message && donation2.net_amount >= this.ttsMinDonationAmount) {
				this.alert.scene.events.emit('loadtts') // and play
			}
			this.alert.soundbehaviour.playSound(donation2)
		})
	}

	private createBanner(donation: Donation) {
		const { message } = donation

		const donationAlertContainer = this.alert.scene.children.getByName(
			donationAlertContainerName
		) as DonationBannerContainer
		const banner = message
			? donationAlertContainer.getByName(donationAlertWithMessageKey)
			: donationAlertContainer.getByName(donationAlertKey)

		if (donationAlertContainer && banner) {
			this.showBannerAndPlayVideo(banner as DonationAlertBanner)
		}
	}

	/**
	 * Prevents video freeze when game is out of focus (i.e. user changes tab on the browser)
	 * donationBanner.setPaused(false)
	 */
	public showBannerAndPlayVideo(donationBanner: DonationAlertBanner) {
		donationBanner.play()
		donationBanner.setPaused(false)
		donationBanner.parentContainer.alpha = 1
	}

	public createVisualEffects(amount: number) {
		if (amount >= ALERT_STAR_AND_FIREWORK_MIN_AMOUNT) {
			this.playStarRain()
			this.playFireWork()
		} else if (amount >= ALERT_STAR_RAIN_MIN_AMOUNT) {
			this.playStarRain()
		} else if (amount >= ALERT_FIREWORKS_MIN_AMOUNT) {
			this.playFireWork()
		}
	}

	public playFireWork() {
		const { width, height } = this.alert.scene.scale
		const positionTimer = this.alert.scene.time.addEvent({
			repeat: -1,
			callback: () => {
				this.fireworksEmitter.setPosition(width * FloatBetween(0.25, 0.75), height * FloatBetween(0, 0.5))
			},
		})
		this.alert.scene.time.addEvent({
			delay: 500,
			repeat: 0,
			callback: () => {
				this.fireworksEmitter.start()
			},
		})

		this.alert.scene.time.addEvent({
			delay: 500,
			repeat: 0,
			callback: () => {
				this.alert.scene.sound.play(FIREWORKS_SOUND_1_AUDIO_KEY)
			},
		})

		this.alert.scene.time.addEvent({
			delay: 1500,
			repeat: 0,
			callback: () => {
				this.alert.scene.sound.play(FIREWORKS_SOUND_1_AUDIO_KEY)
			},
		})

		this.alert.scene.time.addEvent({
			delay: 2500,
			repeat: 0,
			callback: () => {
				this.alert.scene.sound.play(FIREWORKS_SOUND_2_AUDIO_KEY)
			},
		})

		this.alert.scene.time.addEvent({
			delay: 3500,
			repeat: 0,
			callback: () => {
				this.alert.scene.sound.play(FIREWORKS_SOUND_1_AUDIO_KEY)
			},
		})

		this.alert.scene.time.addEvent({
			delay: 4500,
			repeat: 0,
			callback: () => {
				this.alert.scene.sound.play(FIREWORKS_SOUND_1_AUDIO_KEY)
			},
		})

		this.alert.scene.time.addEvent({
			delay: 5000,
			repeat: 0,
			callback: () => {
				positionTimer.destroy()
				this.fireworksEmitter.stop()
			},
		})
	}

	public playStarRain() {
		this.alert.scene.sound.play(STAR_RAIN_SOUND_AUDIO_KEY)
		this.alert.scene.time.addEvent({
			callback: () => {
				for (let i = 0; i <= 3; i++) {
					this.starGroup.add(
						new Star(this.alert.scene, Phaser.Math.Between(20, 1900), -100, blueStarKey, this.starFollowParticle)
					)
				}
			},
			callbackScope: this,
			delay: 200,
			repeat: 60,
		})
	}

	public stop() {
		window.clearInterval(this.checkQueueTimerId)
		this.checkQueueTimerId = undefined
	}
}
