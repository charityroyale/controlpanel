import { Donation } from '@pftp/common'
import { CoinTextAmount } from '../CoinTextAmount'
import {
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
	pigDonationInKey,
	pigDonationKey,
	pigDonationOutKey,
	pigIdleKey,
	pigScratchKey,
	pigSleepKey,
	pigSleepOutKey,
	titleKey,
} from '../../scenes/OverlayScene'
import { Coin } from '../Coin'
import { Pig } from '../Pig'
import { CoinTextDonator } from '../CoinTextDonator'
import { CoinTextDonatorWithMessageBackground } from '../CointTextDonatorWithMessageBackground'
import { CoinTextDonatorMessage } from '../CoinTextDonatorMessage'

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
	private startPositionOffset = -350
	private emitter

	constructor(
		character: Pig,
		queue: Donation[],
		coinGroup: Phaser.GameObjects.Group,
		emitter: Phaser.GameObjects.Particles.ParticleEmitter
	) {
		this.character = character
		this.queue = queue
		this.coinGroup = coinGroup
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

	private createCoin(donation: Donation, coinGroup: Phaser.GameObjects.Group) {
		const { coinTexture, textColor } = this.getCoinKeyFromAmount(donation.amount)
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
		const coinTextDonatorWithMessageBackground = new CoinTextDonatorWithMessageBackground(
			this.character.scene,
			-250,
			100,
			titleKey
		)
		const coinTextDonator = new CoinTextDonator(
			this.character.scene,
			coinTextDonatorWithMessageBackground.x + 20,
			coinTextDonatorWithMessageBackground.y + 30,
			donation.user
		)

		const coinTextDonatorMessage = new CoinTextDonatorMessage(
			this.character.scene,
			coinTextDonatorWithMessageBackground.x + 20,
			coinTextDonatorWithMessageBackground.y + 45,
			donation.message
		)

		this.character.parentContainer.add(coin)
		this.character.parentContainer.add(coinText)
		this.character.parentContainer.add(coinTextDonatorWithMessageBackground)
		this.character.parentContainer.add(coinTextDonator)
		this.character.parentContainer.add(coinTextDonatorMessage)
		coinGroup.add(coin)
	}

	private getCoinKeyFromAmount(amount: number) {
		if (amount >= 1000) {
			return { coinTexture: coin6Key, textColor: coin6TextColor }
		} else if (amount >= 500) {
			this.emitter.start()
			this.character.scene.time.addEvent({
				delay: 5000,
				repeat: 0,
				callback: () => {
					this.emitter.stop()
				},
			})
			return { coinTexture: coin5Key, textColor: coin5TextColor }
		} else if (amount >= 100) {
			return { coinTexture: coin4Key, textColor: coin4TextColor }
		} else if (amount >= 50) {
			return { coinTexture: coin3Key, textColor: coin3TextColor }
		} else if (amount >= 10) {
			return { coinTexture: coin2Key, textColor: coin2TextColor }
		} else {
			return { coinTexture: coin1Key, textColor: coin1TextColor }
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
