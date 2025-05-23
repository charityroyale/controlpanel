import { Donation } from '@cp/common'
import { blueStarKey, donationAlertKey, donationAlertWithMessageKey, TTS_KEY } from '../../scenes/OverlayScene'
import { Star } from '../Star'
import { DonationAlertVideo } from '../containers/donationBanner/DonationBanner'
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
	CONFETTI_MIN_AMOUNT,
} from '../containers/donationBanner/donationSpecialEffectsConfig'
import { GTA_RESPECT_SOUND_AUDIO_KEY, STAR_RAIN_SOUND_AUDIO_KEY } from '../config/sound'
import { formatMoney } from '../../../../../lib/utils'
import { playFireWork } from './specialeffects/fireworks'

export class DonationBehaviour {
	public ttsMinDonationAmount

	private checkQueueTimerId: undefined | number
	private checkQueueTimer = 2000
	private alert: Alert
	private queue
	private starGroup

	private centerX: number
	private centerY: number
	private emitters: any = [] as any
	private maxEmitters = 4

	constructor(alert: Alert, queue: Donation[], starGroup: Phaser.GameObjects.Group, ttsMinDonationAmount: number) {
		this.centerX = alert.scene.cameras.main.width / 2
		this.centerY = alert.scene.cameras.main.height / 2

		this.alert = alert
		this.queue = queue
		this.starGroup = starGroup
		this.ttsMinDonationAmount = ttsMinDonationAmount
		this.initConfetti()

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
		const bannerWithMessage = donationAlertContainer.getByName(donationAlertWithMessageKey) as DonationAlertVideo
		const bannerWithoutMessage = donationAlertContainer.getByName(donationAlertKey) as DonationAlertVideo

		return bannerWithoutMessage.isPlaying() || bannerWithMessage.isPlaying()
	}

	private createTextElements(donation: Donation) {
		const donationAlertContainer = this.alert.scene.children.getByName(
			donationAlertContainerName
		) as DonationBannerContainer
		const donationAlert = donation.message
			? (donationAlertContainer.getByName(donationAlertWithMessageKey) as DonationAlertVideo)
			: (donationAlertContainer.getByName(donationAlertKey) as DonationAlertVideo)

		this.createDonationAlertHeaderText(donation, donationAlert, donationAlertContainer)

		// only create userMessageText object if message is given
		if (donation.message) {
			this.createDonationAlertUserMessageText(donation, donationAlert, donationAlertContainer)
		}
		donationAlert.alpha = 1
	}

	private createDonationAlertHeaderText = (
		donation: Donation,
		donationAlertVideo: DonationAlertVideo,
		donationAlertContainer: DonationBannerContainer
	) => {
		const formatedDonationAmount = donation?.amount_net
			? formatMoney(donation?.amount_net)
			: `${formatMoney(donation.amount)} (inkl. Gebühren)`

		const donationAlertHeaderText = new DonationBannerHeaderText(
			this.alert.scene,
			0,
			360 * donationAlertContainer.scale,
			`${donation.user} spendet ${formatedDonationAmount} €`,
			donationAlertVideo.scale
		)
		donationAlertContainer.add(donationAlertHeaderText)
	}

	private createDonationAlertUserMessageText = (
		donation: Donation,
		donationAlert: DonationAlertVideo,
		donationAlertContainer: DonationBannerContainer
	) => {
		const donationAlertUserMessageText = new DonationBannerMessageText(
			this.alert.scene,
			-545 * donationAlertContainer.scale,
			55 * donationAlertContainer.scale,
			donation.message,
			donationAlert.scale,
			1000 * donationAlertContainer.scale
		)
		donationAlertContainer.add(donationAlertUserMessageText)
	}

	private triggerAlert(donation: Donation) {
		for (let child of this.alert.scene.children.getAll()) {
			if (child instanceof Star) {
				child.starEmitter.destroy(true)
				child.destroy(true)
			}
		}

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
			this.alert.scene.events.emit('loadAndPlayTTS', donation.id)
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
			this.showBannerAndPlayVideo(banner as DonationAlertVideo)
		}
	}

	/**
	 * Prevents video freeze when game is out of focus (i.e. user changes tab on the browser)
	 * donationBanner.setPaused(false)
	 */
	public showBannerAndPlayVideo(donationBanner: DonationAlertVideo) {
		donationBanner.play()
		donationBanner.setPaused(false)
		donationBanner.parentContainer.alpha = 1
	}

	public createVisualEffects(amount: number) {
		const parsedAmount = amount / 100

		const donationAlertContainer = this.alert.scene.children.getByName(
			donationAlertContainerName
		) as DonationBannerContainer

		if (!donationAlertContainer.visible) {
			return
		}

		if (parsedAmount >= ALERT_STAR_AND_FIREWORK_MIN_AMOUNT) {
			this.playStarRain()
			playFireWork(this.alert)
		} else if (parsedAmount >= ALERT_STAR_RAIN_MIN_AMOUNT) {
			this.playStarRain()
		} else if (parsedAmount >= ALERT_FIREWORKS_MIN_AMOUNT) {
			playFireWork(this.alert)
		} else if (parsedAmount >= CONFETTI_MIN_AMOUNT) {
			this.playConfetti()
		}
	}

	public playStarRain() {
		this.alert.scene.sound.play(STAR_RAIN_SOUND_AUDIO_KEY)
		this.alert.scene.time.addEvent({
			callback: () => {
				for (let i = 0; i <= 3; i++) {
					this.starGroup.add(new Star(this.alert.scene, Phaser.Math.Between(20, 1900), -100, blueStarKey))
				}
			},
			callbackScope: this,
			delay: 200,
			repeat: 30,
		})
	}
	initConfetti() {
		const confettiTextures = ['purple_confetti', 'blue_confetti', 'green_confetti', 'orange_confetti', 'red_confetti']

		const fullHeight = this.alert.scene.cameras.main.height
		const position = [
			{ x: 0, y: fullHeight },
			{ x: 0, y: fullHeight },
			{ x: this.alert.scene.cameras.main.width, y: fullHeight },
			{ x: this.alert.scene.cameras.main.width, y: fullHeight },
		]

		for (let i = 0; i < this.maxEmitters; i++) {
			const emitterGroup = [] as any
			const angleToCenter = Phaser.Math.Angle.Between(position[i].x, position[i].y, this.centerX, this.centerY - 150)

			confettiTextures.forEach((texture) => {
				const emitter = this.alert.scene.add.particles(0, 0, texture, {
					quantity: 10,
					lifespan: { min: 2000, max: 4000 },
					speed: { min: 800, max: 1000 },
					gravityY: 420,
					scale: { start: 2.5, end: 0.5 },
					rotate: { min: 0, max: 360 },
					blendMode: 'ADD',
					reserve: 10,
					frequency: 50,
					// @ts-expect-error
					emitZone: {
						type: 'random',
						source: new Phaser.Geom.Line(position[i].x, position[i].y, position[i].x + 50, position[i].y),
					},
					angle: { min: Phaser.Math.RadToDeg(angleToCenter) - 90, max: Phaser.Math.RadToDeg(angleToCenter) + 90 },
					emitting: false,
				})
				emitterGroup.push(emitter)
			})

			this.emitters.push(emitterGroup)
		}
	}

	playConfetti() {
		for (let i = 0; i < this.maxEmitters; i++) {
			// @ts-expect-error
			this.emitters[i].forEach((emitter) => {
				emitter.start()
				this.alert.scene.time.delayedCall(200, () => {
					emitter.stop()
				})
			})
		}
	}

	public stop() {
		window.clearInterval(this.checkQueueTimerId)
		this.checkQueueTimerId = undefined
	}
}
