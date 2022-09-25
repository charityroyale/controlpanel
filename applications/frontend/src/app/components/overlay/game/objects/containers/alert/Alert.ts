import { Donation } from '@cp/common'
import Phaser from 'phaser'
import { OverlayScene } from '../../../scenes/OverlayScene'
import { Behaviour } from '../../behaviour/Behaviour'
import { SoundBehaviour } from '../../behaviour/SoundBehaviour'

export class Alert extends Phaser.GameObjects.Container {
	private behaviour: Behaviour
	public soundbehaviour: SoundBehaviour

	constructor(
		scene: OverlayScene,
		starGroup: Phaser.GameObjects.Group,
		starFollowParticle: Phaser.GameObjects.Particles.ParticleEmitterManager,
		fireworksEmitter: Phaser.GameObjects.Particles.ParticleEmitter,
		ttsMinDonationAmount: number
	) {
		super(scene)
		this.setName('alert')

		this.behaviour = new Behaviour(this, starGroup, starFollowParticle, fireworksEmitter, ttsMinDonationAmount)
		this.soundbehaviour = new SoundBehaviour(scene)

		this.scene.add.existing(this)
	}

	public handleDonation(donation: Donation) {
		if (donation.net_amount < 2) {
			return
		}
		this.behaviour.addToQueue(donation)
	}
}
