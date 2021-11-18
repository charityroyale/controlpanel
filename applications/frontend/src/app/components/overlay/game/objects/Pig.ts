import { CharacterState, CHARACTER_UPDATE, Donation, PFTPSocketEventsMap } from '@pftp/common'
import Phaser from 'phaser'
import { Socket } from 'socket.io-client'
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
	private isLocked
	private pigLaugh

	constructor(
		scene: Phaser.Scene,
		options: PigProps,
		characterState: CharacterState,
		socket: Socket<PFTPSocketEventsMap>
	) {
		super(scene, options.x, options.y, options.texture)

		this.setName('pig')
		this.setScale(characterState.scale)
		this.setIsVisible(characterState.isVisible)

		this.pigLaugh = options.pigLaugh
		this.isLocked = characterState.isLocked
		this.flipX = characterState.flipX

		this.behaviour = new Behaviour(this)
		this.behaviour.idle()

		this.setInteractive()
		scene.input.setDraggable(this)
		this.on('dragend', () => {
			if (!this.isLocked) {
				socket.emit(CHARACTER_UPDATE, {
					position: {
						x: this.x,
						y: this.y,
					},
				})
			}
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		scene.input.on('drag', (_pointer: any, _gameObject: any, dragX: any, dragY: any) => {
			if (!this.isLocked) {
				this.x = dragX
				this.y = dragY
			}
		})

		scene.physics.add.existing(this)
		this.handleState(characterState)
		scene.add.existing(this)
	}

	public handleState(state: CharacterState) {
		if (!this.isLocked && (this.x !== state.position.x || this.y !== state.position.y)) {
			this.x = state.position.x
			this.y = state.position.y
		}

		if (this.isLocked !== state.isLocked) {
			this.isLocked = state.isLocked
		}

		if (this.visible != state.isVisible) {
			this.setIsVisible(state.isVisible)
		}

		if (this.scale != state.scale) {
			this.setScale(state.scale)
		}

		if (this.flipX != state.flipX) {
			this.flipX = state.flipX
		}
	}

	/** placeholder function until pig handling with animations starts */
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
