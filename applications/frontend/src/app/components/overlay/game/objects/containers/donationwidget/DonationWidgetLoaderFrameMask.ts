import { loadingStateMaskTween } from '../../tweens/loadingStateMaskTween'
import { DonationWidgetLoaderFrame } from './DonationWidgetLoaderFrame'

export const donationWidgetLoaderFrameMaskName = 'donationWidgetLoaderFrameMask'
export class DonationWidgetLoaderFrameMask extends Phaser.GameObjects.Graphics {
	constructor(scene: Phaser.Scene, donationWidgetLoaderFrame: DonationWidgetLoaderFrame) {
		super(scene, { x: 1920, y: 0 })
		this.name = donationWidgetLoaderFrameMaskName

		this.fillStyle(0xffffff)
		this.alpha = 0
		this.fillRect(0, 0, 1920, 1080)
		this.fillPath()

		const mask = this.createGeometryMask()
		scene.add.existing(this)

		donationWidgetLoaderFrame.setMask(mask)
		loadingStateMaskTween(scene, this)
	}
}
