import { DonationAlertState, PFTPSocketEventsMap } from '@pftp/common'
import { Socket } from 'socket.io-client'

interface ContainerOptions {
	x?: number | undefined
	y?: number | undefined
	children?: Phaser.GameObjects.GameObject[] | undefined
}

export class DonationAlertContainer extends Phaser.GameObjects.Container {
	constructor(
		scene: Phaser.Scene,
		state: DonationAlertState,
		socket: Socket<PFTPSocketEventsMap>,
		options: ContainerOptions | undefined
	) {
		super(scene, options?.x, options?.y, options?.children)
		this.name = 'donationalertcontainer'
		this.setScale(state.scale)
		this.setIsVisible(state.isVisible)
		this.setPosition(1920 / 2, 100)
		this.setSize(500, 500)

		this.handleState(state)
		scene.add.existing(this)
	}

	public handleState(state: DonationAlertState) {
		this.setIsVisible(state.isVisible)

		if (this.scale != state.scale) {
			this.setScale(state.scale)
		}
	}

	public setIsVisible(visible: boolean) {
		if (this.visible === visible) return
		this.visible = visible
	}
}
