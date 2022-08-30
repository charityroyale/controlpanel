import { Donation } from '@pftp/common'
import { Alert } from '../containers/alert/Alert'
import { DonationBehaviour } from './DonationBehaviour'

export class Behaviour {
	private alert: Alert
	private queue: Donation[] = []
	private donationBehaviour: DonationBehaviour

	constructor(
		alert: Alert,
		starGroup: Phaser.GameObjects.Group,
		starFollowParticle: Phaser.GameObjects.Particles.ParticleEmitterManager,
		fireworksEmitter: Phaser.GameObjects.Particles.ParticleEmitter
	) {
		this.alert = alert
		this.donationBehaviour = new DonationBehaviour(
			this.alert,
			this.queue,
			starGroup,
			starFollowParticle,
			fireworksEmitter
		)
	}

	public startListenForDonations() {
		this.donationBehaviour.startListenForDonations()
	}

	public addToQueue(donation: Donation) {
		this.queue.push(donation)
	}
}
