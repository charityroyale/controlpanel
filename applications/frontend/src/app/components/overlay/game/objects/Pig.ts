import { CharacterState, Donation } from '@pftp/common'
import Phaser, { Physics } from 'phaser'
import {
	coin1Key,
	coin2Key,
	coin3Key,
	coin4Key,
	coin5Key,
	coin6Key,
	coin7Key,
	coin8Key,
	OverlayScene,
} from '../scenes/OverlayScene'
import { Behaviour } from './behaviour/Behaviour'
import { Coin } from './Coin'

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

	constructor(scene: OverlayScene, options: PigProps, characterState: CharacterState) {
		super(scene, options.x, options.y, options.texture)

		this.setName('pig')
		this.setScale(0.82)

		this.pigLaugh = options.pigLaugh
		this.flipX = characterState.flipX

		this.behaviour = new Behaviour(this)
		this.behaviour.idle()

		const body = new Physics.Arcade.StaticBody(this.scene.physics.world, this)
		this.body = body
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
		if (donation.amount < 2) {
			return
		}
		this.behaviour.addToQueue(donation)

		const coin = new Coin(this.scene, 0, -350, this.getCoinKeyFromAmount(donation.amount), this)
		this.parentContainer.add(coin)
		this.playLaughSound()
	}

	public playLaughSound() {
		this.pigLaugh.play()
	}

	public setIsVisible(visible: boolean) {
		if (this.visible === visible) return
		this.visible = visible
	}

	private getCoinKeyFromAmount(amount: number) {
		if (amount >= 1000) {
			return coin8Key
		} else if (amount >= 500) {
			return coin7Key
		} else if (amount >= 250) {
			return coin6Key
		} else if (amount >= 100) {
			return coin5Key
		} else if (amount >= 50) {
			return coin4Key
		} else if (amount >= 10) {
			return coin3Key
		} else if (amount >= 5) {
			return coin2Key
		} else {
			return coin1Key
		}
	}
}
