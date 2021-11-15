import { Donation } from '@pftp/common'
import { pigIdleKey, pigSleepKey } from '../../scenes/OverlayScene'
import { Pig } from '../Pig'

export class DonationBehaviour {
	/**
	 * Checky every second if the queue has items and try
	 * start donation animation.
	 */
	private checkQueueTimerId: undefined | number
	private checkQueueTimer = 1000
	private character: Pig

	private queue: Donation[] = []

	constructor(character: Pig) {
		this.character = character
		this.start()
	}

	private start() {
		this.checkQueueTimerId = window.setInterval(() => {
			if (this.queue.length > 0 && this.character.anims.currentAnim.key !== pigSleepKey) {
				this.queue.pop()
				console.log('hi?')
				this.character.play(pigSleepKey).on('animationcomplete', () => {
					this.character.play(pigIdleKey)
				})
			}
		}, this.checkQueueTimer)
	}

	public addToQueue(donation: Donation) {
		this.queue.push(donation)
	}
}
