import { Donation } from '@pftp/common'
import { Alert } from '../containers/alert/Alert'
import { DonationBehaviour } from './DonationBehaviour'

export class Behaviour {
	private alert: Alert
	private queue: Donation[] = []

	constructor(
		alert: Alert,
		starGroup: Phaser.GameObjects.Group,
		starFollowParticle: Phaser.GameObjects.Particles.ParticleEmitterManager,
		fireworksEmitter: Phaser.GameObjects.Particles.ParticleEmitter
	) {
		this.alert = alert
		new DonationBehaviour(this.alert, this.queue, starGroup, starFollowParticle, fireworksEmitter)
	}

	public addToQueue(donation: Donation) {
		this.queue.push(donation)
	}
}
