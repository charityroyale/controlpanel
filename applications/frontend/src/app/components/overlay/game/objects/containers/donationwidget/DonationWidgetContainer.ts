import { DonationWidgetState, DONATION_WIDGET_UPDATE, PFTPSocketEventsMap } from '@pftp/common'
import { GameObjects } from 'phaser'
import { Socket } from 'socket.io-client'

/**
 * Container for visual DonationWidget
 */
export const donationWidgetContainerName = 'donationWidgetContainer'
export class DonationWidgetContainer extends Phaser.GameObjects.Container {
	constructor(
		scene: Phaser.Scene,
		state: DonationWidgetState,
		socket: Socket<PFTPSocketEventsMap>,
		options: ContainerOptions | undefined
	) {
		super(scene, options?.x, options?.y, options?.children)
		this.name = donationWidgetContainerName
		this.setSize(590, 190)
		this.setScale(state.scale)
		this.setIsVisible(state.isVisible)
		this.setPosition(1920 / 2, 500)

		this.setInteractive()
		this.on('dragend', () => {
			socket.emit(DONATION_WIDGET_UPDATE, {
				position: {
					x: this.x,
					y: this.y,
				},
			})
		})

		this.handleState(state)
		scene.add.existing(this)
	}

	public handleState(state: DonationWidgetState) {
		this.setIsVisible(state.isVisible)

		if (this.x !== state.position.x || this.y !== state.position.y) {
			this.x = state.position.x
			this.y = state.position.y
		}

		if (this.scale != state.scale) {
			this.setScale(state.scale)
			this.scaleContainerItems(state)

			//this.scaleDonationHeaderText()
			//this.scaleDonationUserMessageText()
		}
	}

	private scaleContainerItems = (state: DonationWidgetState) => {
		const containerItems = this.getAll() as GameObjects.Sprite[]
		containerItems.map((items) => items.setScale(state.scale))
	}

	public setIsVisible(visible: boolean) {
		if (this.visible === visible) return
		this.visible = visible
	}
}

interface ContainerOptions {
	x?: number | undefined
	y?: number | undefined
	children?: Phaser.GameObjects.GameObject[] | undefined
}
