import { Donation } from '@pftp/common'
import {
	blueStarKey,
	coin1Key,
	coin1TextColor,
	coin2Key,
	coin2TextColor,
	coin3Key,
	coin3TextColor,
	coin4Key,
	coin4TextColor,
	coin5Key,
	coin5TextColor,
	coin6Key,
	coin6TextColor,
	donationAlertKey,
	donationAlertWithMessageKey,
	donationBackground1Key,
	donationBackground2Key,
	donationBackground3Key,
	donationBackground4Key,
	donationBackground5Key,
	donationBackground6Key,
	FIREWORKS_SOUND_1_AUDIO_KEY,
	FIREWORKS_SOUND_2_AUDIO_KEY,
	pigDonationInKey,
	pigDonationKey,
	pigDonationOutKey,
	pigIdleKey,
	pigScratchKey,
	pigSleepKey,
	pigSleepOutKey,
} from '../../scenes/OverlayScene'
import { Coin } from '../containers/pig/Coin'
import { Star } from '../Star'
import { DonationAlert } from '../containers/donationalert/DonationBanner'
import { DonationAlertContainer } from '../containers/donationalert/DonationAlertContainer'
import { DonationAlertHeaderText } from '../containers/donationalert/DonationAlertHeaderText'
import { DonationAlertUserMessageText } from '../containers/donationalert/DonationAlertUserMessageText'
import { CoinTextAmount } from '../containers/pig/CoinTextAmount'
import { Pig } from '../containers/pig/Pig'

export class DonationBehaviour {
	/**
	 * Checky every second if the queue has items and try
	 * start donation animation.
	 */
	private checkQueueTimerId: undefined | number
	private checkQueueTimer = 500
	private character: Pig
	private queue
	private coinGroup
	private starGroup
	private starFollowParticle
	private startPositionOffset = -350
	private emitter

	constructor(
		character: Pig,
		queue: Donation[],
		coinGroup: Phaser.GameObjects.Group,
		starGroup: Phaser.GameObjects.Group,
		starFollowParticle: Phaser.GameObjects.Particles.ParticleEmitterManager,
		emitter: Phaser.GameObjects.Particles.ParticleEmitter
	) {
		this.character = character
		this.queue = queue
		this.coinGroup = coinGroup
		this.starGroup = starGroup
		this.starFollowParticle = starFollowParticle
		this.emitter = emitter
		this.start()
	}

	public start() {
		this.checkQueueTimerId = window.setInterval(() => {
			if (this.isInDonationStartState()) {
				/**
				 * Default case when in Idle state.
				 */
				if (this.character.anims.currentAnim.key === pigIdleKey) {
					const donation = this.queue.pop()!
					this.character.anims.stopAfterRepeat(1)
					this.character.playLaughSound()
					this.character.play(pigDonationInKey).chain(pigDonationKey)
					this.createCoin(donation, this.coinGroup)
					this.createDonationAlertText(donation)
					/**
					 * Sleeping can be seen as another idle state from which the wakeUp
					 * animation needs to bestarted additional
					 */
				} else if (this.character.anims.currentAnim.key === pigSleepKey) {
					const donation = this.queue.pop()!
					this.character.anims.stopAfterRepeat(1)
					this.character.playLaughSound()
					this.character.play(pigSleepOutKey).chain(pigDonationInKey).chain(pigDonationKey)
					this.createCoin(donation, this.coinGroup)
					this.createDonationAlertText(donation)
				}
			}
		}, this.checkQueueTimer)
	}

	private isInDonationStartState() {
		return (
			this.queue.length > 0 &&
			this.character.anims.currentAnim.key !== pigDonationKey &&
			this.character.anims.currentAnim.key !== pigDonationInKey &&
			this.character.anims.currentAnim.key !== pigDonationOutKey &&
			this.character.anims.currentAnim.key !== pigScratchKey &&
			this.character.anims.currentAnim.key !== pigSleepOutKey
		)
	}

	/**
	 * username: max 30
	 * message: frontend: 200
	 */
	private createDonationAlertText(donation: Donation) {
		const container = this.character.scene.children.getByName('donationalertcontainer') as DonationAlertContainer
		const banner = donation.message
			? (container.getByName(donationAlertWithMessageKey) as DonationAlert)
			: (container.getByName(donationAlertKey) as DonationAlert)

		const formatedDonationAmount = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
			donation.amount
		)

		const donationAlertHeaderText = new DonationAlertHeaderText(
			this.character.scene,
			0,
			banner.displayHeight - 240 * container.scale,
			`${donation.user} spendet ${formatedDonationAmount}`,
			banner.scale
		)

		if (donation.message) {
			const donationAlertUserMessageText = new DonationAlertUserMessageText(
				this.character.scene,
				banner.x - (banner.displayWidth / 2 - 50),
				banner.displayHeight - 540 * container.scale,
				donation.message,
				banner.scale,
				banner.displayWidth - 70 * 2
			)
			container.add(donationAlertUserMessageText)
		}
		banner.alpha = 1

		container.add(donationAlertHeaderText)
	}

	private createCoin(donation: Donation, coinGroup: Phaser.GameObjects.Group) {
		const { coinTexture, textColor } = this.getCoinKeyFromAmount(donation)
		const coin = new Coin(this.character.scene, 0, this.startPositionOffset, coinTexture)
		const formatedDonationAmount = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
			donation.amount
		)
		const coinText = new CoinTextAmount(
			this.character.scene,
			0,
			this.startPositionOffset,
			formatedDonationAmount,
			textColor
		)

		this.character.parentContainer.add(coin)
		this.character.parentContainer.add(coinText)
		coinGroup.add(coin)
	}

	private getCoinKeyFromAmount(donation: Donation) {
		const { amount, message } = donation
		const donationAlertContainer = this.character.scene.children.getByName(
			'donationalertcontainer'
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

		if (amount >= 1000) {
			this.character.scene.time.addEvent({
				callback: () => {
					for (let i = 0; i <= 3; i++) {
						this.starGroup.add(
							new Star(this.character.scene, Phaser.Math.Between(20, 1900), -100, blueStarKey, this.starFollowParticle)
						)
					}
				},
				callbackScope: this,
				delay: 200,
				repeat: 60,
			})

			return { coinTexture: coin6Key, textColor: coin6TextColor, messageBackgroundTexture: donationBackground6Key }
		} else if (amount >= 500) {
			this.character.scene.time.addEvent({
				delay: 500,
				repeat: 0,
				callback: () => {
					this.emitter.start()
				},
			})

			this.character.scene.time.addEvent({
				delay: 500,
				repeat: 0,
				callback: () => {
					this.character.scene.sound.play(FIREWORKS_SOUND_1_AUDIO_KEY)
				},
			})

			this.character.scene.time.addEvent({
				delay: 1500,
				repeat: 0,
				callback: () => {
					this.character.scene.sound.play(FIREWORKS_SOUND_1_AUDIO_KEY)
				},
			})

			this.character.scene.time.addEvent({
				delay: 2500,
				repeat: 0,
				callback: () => {
					this.character.scene.sound.play(FIREWORKS_SOUND_2_AUDIO_KEY)
				},
			})

			this.character.scene.time.addEvent({
				delay: 3500,
				repeat: 0,
				callback: () => {
					this.character.scene.sound.play(FIREWORKS_SOUND_1_AUDIO_KEY)
				},
			})

			this.character.scene.time.addEvent({
				delay: 4500,
				repeat: 0,
				callback: () => {
					this.character.scene.sound.play(FIREWORKS_SOUND_1_AUDIO_KEY)
				},
			})

			this.character.scene.time.addEvent({
				delay: 5000,
				repeat: 0,
				callback: () => {
					this.emitter.stop()
				},
			})
			return { coinTexture: coin5Key, textColor: coin5TextColor, messageBackgroundTexture: donationBackground5Key }
		} else if (amount >= 100) {
			return { coinTexture: coin4Key, textColor: coin4TextColor, messageBackgroundTexture: donationBackground4Key }
		} else if (amount >= 50) {
			return { coinTexture: coin3Key, textColor: coin3TextColor, messageBackgroundTexture: donationBackground3Key }
		} else if (amount >= 10) {
			return { coinTexture: coin2Key, textColor: coin2TextColor, messageBackgroundTexture: donationBackground2Key }
		} else {
			return { coinTexture: coin1Key, textColor: coin1TextColor, messageBackgroundTexture: donationBackground1Key }
		}
	}

	public stop() {
		window.clearInterval(this.checkQueueTimerId)
		this.checkQueueTimerId = undefined
	}

	public reset() {
		this.stop()
		this.start()
	}
}
