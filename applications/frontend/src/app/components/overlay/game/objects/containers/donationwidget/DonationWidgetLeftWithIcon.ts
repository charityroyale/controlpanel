import { DonationWidgetState } from '@cp/common'

const donationWidgetLeftWithIconName = 'donationWidgetLeftWithIcon'
export class DonationWidgetLeftWithIcon extends Phaser.GameObjects.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number, state: DonationWidgetState, texture: string) {
		super(scene, x, y, texture)
		this.name = donationWidgetLeftWithIconName
		this.setOrigin(0.5, 0)
		this.setScale(state.scale)
		this.scene.add.existing(this)
	}
}
