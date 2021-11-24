import { DonationAlertState, DONATION_ALERT_UPDATE, PFTPSocketEventsMap } from '@pftp/common'
import { Socket } from 'socket.io-client'

export class DonationBanner extends Phaser.GameObjects.Video {
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		state: DonationAlertState,
		socket: Socket<PFTPSocketEventsMap>,
		key?: string | undefined
	) {
		super(scene, x, y, key)
		this.name = 'donationBanner'
		this.setOrigin(0.5, 0)
		this.setScale(state.scale)

		this.play(true)
		// Prevents video freeze when game is out of focus (i.e. user changes tab on the browser)
		this.setPaused(false)

		this.handleState(state)
		this.scene.add.existing(this)
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
