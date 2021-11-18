import { Donation } from '@pftp/common'
import {
	pigDonationInKey,
	pigDonationKey,
	pigDonationOutKey,
	pigIdleKey,
	pigSleepKey,
	pigSleepOutKey,
} from '../../scenes/OverlayScene'
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

	constructor(character: Pig, queue: Donation[]) {
		this.character = character
		this.queue = queue
		this.start()
	}

	public start() {
		this.checkQueueTimerId = window.setInterval(() => {
			if (
				this.queue.length > 0 &&
				this.character.anims.currentAnim.key !== pigDonationKey &&
				this.character.anims.currentAnim.key !== pigDonationInKey &&
				this.character.anims.currentAnim.key !== pigDonationOutKey &&
				this.character.anims.currentAnim.key !== pigSleepOutKey
			) {
				if (this.character.anims.currentAnim.key === pigIdleKey) {
					this.queue.pop()
					this.character.play(pigDonationInKey).chain(pigDonationKey)
				}

				if (this.character.anims.currentAnim.key === pigSleepKey) {
					this.queue.pop()
					this.character.play(pigSleepOutKey).chain(pigDonationInKey).chain(pigDonationKey)
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
