import { DonationWidgetState } from '@cp/common'
import { DONATION_WIDGET_STATE_LOADING } from '../../../scenes/OverlayScene'

export const donationWidgetLoaderFrameName = 'donationWidgetLoaderFrame'
export class DonationWidgetLoaderFrame extends Phaser.GameObjects.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number, state: DonationWidgetState) {
		super(scene, x, y, DONATION_WIDGET_STATE_LOADING)
		this.name = donationWidgetLoaderFrameName
		this.setOrigin(1, 0)
		this.setScale(state.scale)
		this.scene.add.existing(this)
	}
}
