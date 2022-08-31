import { Donation } from '@pftp/common'
import {
	blueStarKey,
	donationAlertKey,
	donationAlertWithMessageKey,
	FIREWORKS_SOUND_1_AUDIO_KEY,
	FIREWORKS_SOUND_2_AUDIO_KEY,
	STAR_RAIN_SOUND_AUDIO_KEY,
} from '../../scenes/OverlayScene'
import { Star } from '../Star'
import { DonationAlert } from '../containers/donationalert/DonationBanner'
import { DonationAlertContainer, donationAlertContainerName } from '../containers/donationalert/DonationAlertContainer'
import { DonationAlertHeaderText } from '../containers/donationalert/DonationAlertHeaderText'
import { DonationAlertUserMessageText } from '../containers/donationalert/DonationAlertUserMessageText'
import { Alert } from '../containers/alert/Alert'
import { ALERT_FIREWORKS_MIN_AMOUNT, ALERT_STAR_RAIN_MIN_AMOUNT } from '../containers/donationalert/donationConfig'
import { formatDonationAlertCurrenty } from '../../../../../lib/utils'
const { FloatBetween } = Phaser.Math

export class DonationBehaviour {
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
		fireworksEmitter: Phaser.GameObjects.Particles.ParticleEmitter
	) {
		this.alert = alert
		this.queue = queue
		this.starGroup = starGroup
		this.starFollowParticle = starFollowParticle
		this.fireworksEmitter = fireworksEmitter
		this.startListenForDonations()
	}

	public startListenForDonations() {
		this.checkQueueTimerId = window.setInterval(() => {
			if (this.queue.length > 0) {
				this.triggerAlert(this.queue.shift()!)
			}
		}, this.checkQueueTimer)
	}

	private createAlertText(donation: Donation) {
		const donationAlertContainer = this.alert.scene.children.getByName(
			donationAlertContainerName
		) as DonationAlertContainer
		const donationAlert = donation.message
			? (donationAlertContainer.getByName(donationAlertWithMessageKey) as DonationAlert)
			: (donationAlertContainer.getByName(donationAlertKey) as DonationAlert)

		this.createDonationAlertHeaderText(donation, donationAlert, donationAlertContainer)

		// only create userMessageText object if message is given
		if (donation.message) {
			this.createDonationAlertUserMessageText(donation, donationAlert, donationAlertContainer)
		}
		donationAlert.alpha = 1
	}

	private createDonationAlertHeaderText = (
		donation: Donation,
		donationAlert: DonationAlert,
		donationAlertContainer: DonationAlertContainer
	) => {
		const formatedDonationAmount = formatDonationAlertCurrenty(donation.amount)
		const donationAlertHeaderText = new DonationAlertHeaderText(
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
		donationAlert: DonationAlert,
		donationAlertContainer: DonationAlertContainer
	) => {
		const donationAlertUserMessageText = new DonationAlertUserMessageText(
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
		this.createAlert(donation)
		this.createAlertText(donation)
		this.alert.text2speech.speak(donation.message)
	}

	private createAlert(donation: Donation) {
		const { amount, message } = donation
		const donationAlertContainer = this.alert.scene.children.getByName(
			donationAlertContainerName
		) as DonationAlertContainer
		const banner = message
			? donationAlertContainer.getByName(donationAlertWithMessageKey)
			: donationAlertContainer.getByName(donationAlertKey)

		if (donationAlertContainer && banner) {
			const donationBanner = banner as DonationAlert
			donationBanner.play()
			// Prevents video freeze when game is out of focus (i.e. user changes tab on the browser)
			donationBanner.setPaused(false)
			donationBanner.parentContainer.alpha = 1
		}

		if (amount >= ALERT_STAR_RAIN_MIN_AMOUNT) {
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
		} else if (amount >= ALERT_FIREWORKS_MIN_AMOUNT) {
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
	}

	public stop() {
		window.clearInterval(this.checkQueueTimerId)
		this.checkQueueTimerId = undefined
	}

	public reset() {
		this.stop()
		this.startListenForDonations()
	}
}
