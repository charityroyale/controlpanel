import { Donation } from '@cp/common'
import { blueStarKey, donationAlertKey, donationAlertWithMessageKey, flaresAtlasKey, TTS_KEY } from '../../scenes/OverlayScene'
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
import {
	FIREWORKS_SOUND_1_AUDIO_KEY,
	FIREWORKS_SOUND_2_AUDIO_KEY,
	GTA_RESPECT_SOUND_AUDIO_KEY,
	STAR_RAIN_SOUND_AUDIO_KEY,
} from '../config/sound'

// Inspired by https://codepen.io/samme/pen/eYEearb @sammee on github
const fireworksEmitterConfig: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
	alpha: { start: 1, end: 0, ease: 'Cubic.easeIn' },
	angle: { start: 0, end: 360, steps: 100 },
	blendMode: 'ADD',
	frequency: 1000,
	gravityY: 600,
	lifespan: 1800,
	quantity: 500,
	reserve: 500,
	scale: { min: 0.02, max: 0.35 },
	speed: { min: 200, max: 600 },
	x: 550,
	y: 350,
	emitting: false
}


export class DonationBehaviour {
	public ttsMinDonationAmount

	/**
	 * Checky every second if the queue has items and try
	 * start donation animation.
	 */
	private checkQueueTimerId: undefined | number
	private checkQueueTimer = 2000
	private alert: Alert
	private queue
	private starGroup

	constructor(
		alert: Alert,
		queue: Donation[],
		starGroup: Phaser.GameObjects.Group,
		ttsMinDonationAmount: number
	) {
		this.alert = alert
		this.queue = queue
		this.starGroup = starGroup
		this.ttsMinDonationAmount = ttsMinDonationAmount

		this.alert.scene.events.on('ttsUpdated', (ttsMinDonationAmount: number) => {
			if (ttsMinDonationAmount !== this.ttsMinDonationAmount) {
				this.ttsMinDonationAmount = ttsMinDonationAmount
			}
		})
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
		const formatedDonationAmount = donation?.amount_net ? formatDonationAlertCurrenty(donation?.amount_net) : `${formatDonationAlertCurrenty(donation.amount)} (inkl. Gebühren)`
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
		if (donation.fullFilledWish) {
			const audio = this.alert.scene.game.cache.audio.exists(GTA_RESPECT_SOUND_AUDIO_KEY)
			if (audio) {
				this.alert.scene.sound.play(GTA_RESPECT_SOUND_AUDIO_KEY)
			}
		}

		// default behaviour
		this.createBanner(donation)
		this.createTextElements(donation)

		// amount based effects
		this.createVisualEffects(donation.amount_net ?? donation.amount)

		if (donation.message && (donation.amount_net || donation.amount) >= this.ttsMinDonationAmount) {
			this.alert.scene.events.emit('loadAndPlayTTS', donation.id) // and play
		}
		this.alert.soundbehaviour.playSound(donation)
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
		this.alert.scene.time.addEvent({
			repeat: 4,
			delay: 1500,
			startAt: 100,
			callback: () => {
				const fireworksEmitter = this.alert.scene.add.particles(0,0, blueStarKey, fireworksEmitterConfig)
				fireworksEmitter.setPosition(width * Phaser.Math.FloatBetween(0.2, 0.8), height * Phaser.Math.FloatBetween(0, 0.2))
				fireworksEmitter.explode()

				this.alert.scene.sound.play(Phaser.Math.Between(0,1) > 0 ? FIREWORKS_SOUND_1_AUDIO_KEY: FIREWORKS_SOUND_2_AUDIO_KEY)
			},
		})
	}

	public playStarRain() {
		this.alert.scene.sound.play(STAR_RAIN_SOUND_AUDIO_KEY)
		this.alert.scene.time.addEvent({
			callback: () => {
				for (let i = 0; i <= 3; i++) {
					this.starGroup.add(
						new Star(this.alert.scene, Phaser.Math.Between(20, 1900), -100, blueStarKey)
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
