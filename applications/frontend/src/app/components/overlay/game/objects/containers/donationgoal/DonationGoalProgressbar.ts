import { DonationGoalState } from '@cp/common'

export const donationGoalProgressBarName = 'donationgoalprogressbar'
export const donationGoalProgressBackgroundBarName = 'donationgoalprogressbarbackground'

export const maxDonationGoalProgressBarWidth = 431
export class DonationGoalProgressbar extends Phaser.GameObjects.Rectangle {
	constructor(scene: Phaser.Scene, x: number, y: number, state: DonationGoalState, name: string, color: number) {
		super(scene, x, y, maxDonationGoalProgressBarWidth, 30, color)
		this.name = name
		this.setOrigin(0.5, 0)
		this.setScale(state.scale)

		this.isStroked = true
		this.lineWidth = 1.5
		this.strokeColor = 0xffffff

		this.scene.add.existing(this)
	}
}
