import { CharacterState, CHARACTER_UPDATE, PFTPSocketEventsMap } from '@pftp/common'
import { Socket } from 'socket.io-client'

interface ContainerOptions {
	x?: number | undefined
	y?: number | undefined
	children?: Phaser.GameObjects.GameObject[] | undefined
}

export class OverlayContainer extends Phaser.GameObjects.Container {
	private isLocked

	constructor(
		scene: Phaser.Scene,
		characterState: CharacterState,
		socket: Socket<PFTPSocketEventsMap>,
		options: ContainerOptions | undefined
	) {
		super(scene, options?.x, options?.y, options?.children)
		this.name = 'overlaycontainer'
		this.setSize(500, 500)
		this.setScale(characterState.scale)
		this.setIsVisible(characterState.isVisible)
		this.isLocked = characterState.isLocked

		this.setInteractive()
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
	}
	public setIsVisible(visible: boolean) {
		if (this.visible === visible) return
		this.visible = visible
	}
}
