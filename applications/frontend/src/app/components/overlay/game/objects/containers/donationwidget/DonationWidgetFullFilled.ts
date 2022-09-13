import { DonationWidgetState } from '@pftp/common'

export const donationWidgetFullFilledName = 'donationWidgetFullFilled'
export class DonationWidgetFullFilled extends Phaser.GameObjects.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number, state: DonationWidgetState, texture: string) {
		super(scene, x, y, texture)
		this.name = donationWidgetFullFilledName
		this.setOrigin(0, 0)
		this.setScale(state.scale)
		this.scene.add.existing(this)
	}
}
