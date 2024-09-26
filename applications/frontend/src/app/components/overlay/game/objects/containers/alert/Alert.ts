import { Donation } from '@cp/common'
import Phaser from 'phaser'
import { OverlayScene } from '../../../scenes/OverlayScene'
import { Behaviour } from '../../behaviour/Behaviour'
import { SoundBehaviour } from '../../behaviour/SoundBehaviour'

const MIN_DONATION_AMOUNT_EUR = 2
export class Alert extends Phaser.GameObjects.Container {
	private behaviour: Behaviour
	public soundbehaviour: SoundBehaviour

	constructor(scene: OverlayScene, starGroup: Phaser.GameObjects.Group, ttsMinDonationAmount: number) {
		super(scene)
		this.setName('alert')

		this.behaviour = new Behaviour(this, starGroup, ttsMinDonationAmount)
		this.soundbehaviour = new SoundBehaviour(scene)

		this.scene.add.existing(this)
	}

	public handleDonation(donation: Donation) {
		const { amount_net, amount } = donation
		if (
			(amount_net && amount_net / 100 < MIN_DONATION_AMOUNT_EUR) ||
			(amount && amount / 100 < MIN_DONATION_AMOUNT_EUR)
		) {
			return
		}
		this.behaviour.addToQueue(donation)
	}
}
