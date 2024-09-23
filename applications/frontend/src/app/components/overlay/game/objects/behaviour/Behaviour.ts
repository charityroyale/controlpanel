import { Donation } from '@cp/common'
import { Alert } from '../containers/alert/Alert'
import { DonationBehaviour } from './DonationBehaviour'

export class Behaviour {
	private alert: Alert
	private queue: Donation[] = []

	constructor(
		alert: Alert,
		starGroup: Phaser.GameObjects.Group,
		ttsMinDonationAmount: number
	) {
		this.alert = alert
		new DonationBehaviour(this.alert, this.queue, starGroup, ttsMinDonationAmount)
	}

	public addToQueue(donation: Donation) {
		this.queue.push(donation)
	}
}
