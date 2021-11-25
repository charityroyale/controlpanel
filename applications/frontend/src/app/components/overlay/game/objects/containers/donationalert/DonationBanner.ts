import { DonationAlertState } from '@pftp/common'

export class DonationBanner extends Phaser.GameObjects.Video {
	constructor(scene: Phaser.Scene, x: number, y: number, state: DonationAlertState, key?: string | undefined) {
		super(scene, x, y, key)
		this.name = 'donationBanner'
		this.setOrigin(0.5, 0)
		this.setScale(state.scale)

		this.scene.add.existing(this)
	}
}
