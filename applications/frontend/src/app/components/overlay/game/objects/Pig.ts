import { CharacterState, Donation } from '@pftp/common'
import Phaser from 'phaser'
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

	constructor(scene: Phaser.Scene, options: PigProps, characterState: CharacterState) {
		super(scene, options.x, options.y, options.texture)

		this.setName('pig')
		this.setScale(0.82)

		this.pigLaugh = options.pigLaugh
		this.flipX = characterState.flipX

		this.behaviour = new Behaviour(this)
		this.behaviour.idle()

		scene.physics.add.existing(this)
		this.handleState(characterState)
		scene.add.existing(this)
	}

	public handleState(state: CharacterState) {
		if (this.flipX != state.flipX) {
			this.flipX = state.flipX
		}
	}

	public handleDonation(donation: Donation) {
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
