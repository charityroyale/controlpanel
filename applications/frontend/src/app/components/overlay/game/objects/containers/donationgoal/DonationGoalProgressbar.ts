import { DonationGoalState } from '@cp/common'

export const donationGoalProgressBarName = 'donationgoalprogressbar'
export class DonationGoalProgressbar extends Phaser.GameObjects.Rectangle {
	constructor(scene: Phaser.Scene, x: number, y: number, state: DonationGoalState, name: string, color: number) {
		super(scene, x, y, 500, 50, color)
		this.name = name
		this.setOrigin(0.5, 0)
		this.setScale(state.scale)

		this.scene.add.existing(this)
	}
}
