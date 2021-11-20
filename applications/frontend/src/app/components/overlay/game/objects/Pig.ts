import { CharacterState, Donation } from '@pftp/common'
import Phaser, { Physics } from 'phaser'
import { OverlayScene } from '../scenes/OverlayScene'
import { Behaviour } from './behaviour/Behaviour'

interface PigProps {
	texture: string
	x: number
	y: number
	pigLaugh: Phaser.Sound.BaseSound
}

export const PigAnimationKeys = {
	idle: 'idle',
	sleep: 'sleep',
	scratch: 'scratch',
}

export class Pig extends Phaser.GameObjects.Sprite {
	private behaviour: Behaviour
	private pigLaugh

	constructor(
		scene: OverlayScene,
		options: PigProps,
		characterState: CharacterState,
		coinGroup: Phaser.GameObjects.Group
	) {
		super(scene, options.x, options.y, options.texture)

		this.setName('pig')
		this.setScale(0.82)

		this.pigLaugh = options.pigLaugh
		this.flipX = characterState.flipX

		this.behaviour = new Behaviour(this, coinGroup)
		this.behaviour.idle()

		const body = new Physics.Arcade.Body(this.scene.physics.world, this)
		body.allowGravity = false
		this.body = body
		scene.physics.add.existing(this)
		this.handleState(characterState)
	}

	public handleState(state: CharacterState) {
		if (this.flipX != state.flipX) {
			this.flipX = state.flipX
		}
	}

	public handleDonation(donation: Donation) {
		if (donation.amount < 2) {
			return
		}
		this.behaviour.addToQueue(donation)
		this.playLaughSound()
	}

	public playLaughSound() {
		this.pigLaugh.play()
	}

	public setIsVisible(visible: boolean) {
		if (this.visible === visible) return
		this.visible = visible
	}
}
