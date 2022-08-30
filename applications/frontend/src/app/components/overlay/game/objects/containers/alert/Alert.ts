import { Donation } from '@pftp/common'
import Phaser from 'phaser'
import { OverlayScene } from '../../../scenes/OverlayScene'
import { Behaviour } from '../../behaviour/Behaviour'

export class Alert extends Phaser.GameObjects.Container {
	private behaviour: Behaviour

	constructor(
		scene: OverlayScene,
		starGroup: Phaser.GameObjects.Group,
		starFollowParticle: Phaser.GameObjects.Particles.ParticleEmitterManager,
		fireworksEmitter: Phaser.GameObjects.Particles.ParticleEmitter
	) {
		super(scene)
		this.setName('alert')

		this.behaviour = new Behaviour(this, starGroup, starFollowParticle, fireworksEmitter)
		this.behaviour.startListenForDonations()

		this.scene.add.existing(this)
	}

	public handleDonation(donation: Donation) {
		if (donation.amount < 2) {
			return
		}
		this.behaviour.addToQueue(donation)
	}
}
