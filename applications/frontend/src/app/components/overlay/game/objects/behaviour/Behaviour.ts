import { Donation } from '@pftp/common'
import { Pig, PigAnimationKeys } from '../Pig'
import { DonationBehaviour } from './DonationBehaviour'
import { Sleep } from './Sleep'

export interface PigBehaviour {
	start: () => void
	stop: () => void
	reset: () => void
}

export class Behaviour {
	private character: Pig
	private queue: Donation[] = []

	private sleepBehaviour: Sleep
	private donationBehaviour: DonationBehaviour

	constructor(character: Pig, coinGroup: Phaser.GameObjects.Group) {
		this.character = character
		this.donationBehaviour = new DonationBehaviour(this.character, this.queue, coinGroup)
		this.sleepBehaviour = new Sleep(this.character)
	}

	public idle() {
		this.character.play(PigAnimationKeys.idle)
		this.sleepBehaviour.start()
		this.donationBehaviour.start()
	}

	public resetSleepBehaviourTimer() {
		this.sleepBehaviour.reset()
	}

	public addToQueue(donation: Donation) {
		this.resetSleepBehaviourTimer()
		this.queue.push(donation)
	}
}
