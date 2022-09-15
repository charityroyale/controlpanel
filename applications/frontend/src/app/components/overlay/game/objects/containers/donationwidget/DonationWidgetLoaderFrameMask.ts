import { DonationWidgetState } from '@cp/common'
import { loadingStateMaskTween } from '../../tweens/loadingStateMaskTween'
import { DonationWidgetLoaderFrame } from './DonationWidgetLoaderFrame'

export const donationWidgetLoaderFrameMaskName = 'donationWidgetLoaderFrameMask'
export class DonationWidgetLoaderFrameMask extends Phaser.GameObjects.Graphics {
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		width: number,
		height: number,
		state: DonationWidgetState,
		donationWidgetLoaderFrame: DonationWidgetLoaderFrame
	) {
		super(scene, { x, y })
		this.name = donationWidgetLoaderFrameMaskName
		this.setScale(state.scale)

		this.fillStyle(0xffffff)
		// this.alpha = 1
		this.fillRect(x, y, width, height)
		this.fillPath()

		const mask = this.createGeometryMask()
		this.scene.add.existing(this)

		donationWidgetLoaderFrame.setMask(mask)
	}

	public startTween() {
		console.log('Starting tween')
		loadingStateMaskTween(this.scene, this)
	}
}
