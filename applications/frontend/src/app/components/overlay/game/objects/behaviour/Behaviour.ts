import { Donation } from '@pftp/common'
import { Pig, PigAnimationKeys } from '../Pig'
import { DonationBehaviour } from './DonationBehaviour'
import { Sleep } from './Sleep'

export interface PigBehaviour {
	startInterval: () => void
	stopInterval: () => void
}

export class Behaviour {
	private character: Pig
	private queue: DonationBehaviour

	private isIdle = true

	private scratchTimer = 10000
	private scratchTimerId = null

	private sleepBehaviour: Sleep

	constructor(character: Pig) {
		this.character = character
		this.queue = new DonationBehaviour(this.character)
		this.sleepBehaviour = new Sleep(this.character)
	}

	public idle() {
		console.log(this.character)
		this.character.play(PigAnimationKeys.idle)

		this.sleepBehaviour.startInterval()

		this.isIdle = true
	}

	public endIdle() {
		this.sleepBehaviour.stopInterval()

		this.isIdle = false
	}

	public addToQueue(donation: Donation) {
		this.queue.addToQueue(donation)
	}
}
