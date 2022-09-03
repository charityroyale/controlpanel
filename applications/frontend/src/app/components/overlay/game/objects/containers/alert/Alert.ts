import { Donation } from '@pftp/common'
import Phaser from 'phaser'
import { OverlayScene } from '../../../scenes/OverlayScene'
import { Behaviour } from '../../behaviour/Behaviour'
import { Text2Speech } from '../../behaviour/Text2Speech'

export class Alert extends Phaser.GameObjects.Container {
	private behaviour: Behaviour
	public text2speech: Text2Speech

	constructor(
		scene: OverlayScene,
		text2speech: Text2Speech,
		starGroup: Phaser.GameObjects.Group,
		starFollowParticle: Phaser.GameObjects.Particles.ParticleEmitterManager,
		fireworksEmitter: Phaser.GameObjects.Particles.ParticleEmitter
	) {
		super(scene)
		this.setName('alert')

		this.text2speech = text2speech
		this.behaviour = new Behaviour(this, starGroup, starFollowParticle, fireworksEmitter)

		this.scene.add.existing(this)
	}

	public handleDonation(donation: Donation) {
		if (donation.amount < 2) {
			return
		}
		this.behaviour.addToQueue(donation)
	}
}
