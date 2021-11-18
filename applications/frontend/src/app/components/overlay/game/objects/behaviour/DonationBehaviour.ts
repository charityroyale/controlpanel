import { Donation } from '@pftp/common'
import { pigDonationKey, pigIdleKey, pigSleepKey, pigSleepOutKey } from '../../scenes/OverlayScene'
import { Pig } from '../Pig'

export class DonationBehaviour {
	/**
	 * Checky every second if the queue has items and try
	 * start donation animation.
	 */
	private checkQueueTimerId: undefined | number
	private checkQueueTimer = 500
	private character: Pig
	private queue
	private donationAnimationKey = pigDonationKey

	constructor(character: Pig, queue: Donation[]) {
		this.character = character
		this.queue = queue
		this.start()
	}

	public start() {
		this.checkQueueTimerId = window.setInterval(() => {
			if (
				this.queue.length > 0 &&
				this.character.anims.currentAnim.key !== this.donationAnimationKey &&
				this.character.anims.currentAnim.key !== pigSleepOutKey
			) {
				if (this.character.anims.currentAnim.key === pigIdleKey) {
					this.queue.pop()
					this.character.play(this.donationAnimationKey).chain(pigIdleKey)
				}

				if (this.character.anims.currentAnim.key === pigSleepKey) {
					this.queue.pop()
					this.character.play(pigSleepOutKey).chain(this.donationAnimationKey).chain(pigIdleKey)
				}
			}
		}, this.checkQueueTimer)
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
