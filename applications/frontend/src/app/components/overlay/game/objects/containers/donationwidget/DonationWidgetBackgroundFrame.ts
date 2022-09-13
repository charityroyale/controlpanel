import { DonationWidgetState } from '@pftp/common'

const donationWidgetBackgroundFrameName = 'donationWidgetBackgroundFrame'
export class DonationWidgetBackgroundFrame extends Phaser.GameObjects.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number, state: DonationWidgetState, texture: string) {
		super(scene, x, y, texture)
		this.name = donationWidgetBackgroundFrameName
		this.setOrigin(0.5, 0)
		this.setScale(state.scale)
		this.scene.add.existing(this)
	}
}
