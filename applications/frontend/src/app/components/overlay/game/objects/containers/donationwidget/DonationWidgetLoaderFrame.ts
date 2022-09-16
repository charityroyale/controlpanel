import { DonationWidgetState } from '@cp/common'
import { DONATION_WIDGET_STATE_LOADING } from '../../../scenes/OverlayScene'
import { DonationWidgetLoaderFrameMask, donationWidgetLoaderFrameMaskName } from './DonationWidgetLoaderFrameMask'

export const donationWidgetLoaderFrameName = 'donationWidgetLoaderFrame'
export class DonationWidgetLoaderFrame extends Phaser.GameObjects.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number, state: DonationWidgetState) {
		super(scene, x, y, DONATION_WIDGET_STATE_LOADING)
		this.name = donationWidgetLoaderFrameName
		this.setOrigin(1, 0)
		this.visible = false
		this.setScale(state.scale)

		this.scene.add.existing(this)
	}

	public showLoadingState() {
		this.visible = true
		const frameMask = this.scene.children.getByName(donationWidgetLoaderFrameMaskName) as DonationWidgetLoaderFrameMask
		if (!frameMask) {
			new DonationWidgetLoaderFrameMask(this.scene, this)
		}
	}
}
