import { DonationWidgetState } from '@pftp/common'

export const maxProgressBarWidth = 431
export class DonationWidgetProgressBar extends Phaser.GameObjects.Rectangle {
	constructor(scene: Phaser.Scene, x: number, y: number, state: DonationWidgetState, name: string, color: number) {
		super(scene, x, y, maxProgressBarWidth, 30, color)
		this.name = name
		this.setOrigin(0, 0.5)
		this.setScale(state.scale)

		scene.add.existing(this)
	}
}

export const donationWidgetProgressBarBackgroundName = 'donationWidgetProgressBarBackground'
export const donationWidgetProgressBarName = 'donationWidgetProgressBar'
