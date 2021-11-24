import { DonationAlertState } from '@pftp/common'

export class DonationBanner extends Phaser.GameObjects.Video {
	constructor(scene: Phaser.Scene, x: number, y: number, state: DonationAlertState, key?: string | undefined) {
		super(scene, x, y, key)
		this.name = 'donationBanner'
		this.setOrigin(0.5, 0)
		this.setScale(state.scale)
		this.alpha = 0

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
