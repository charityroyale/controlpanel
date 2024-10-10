import { DonationChallengeState } from '@cp/common'

export const donationChallengeProgressBarName = 'donationChallengeProgressBar'
export const donationChallengeProgressBarBackgroundName = 'donationChallengeProgressBarBackground'

export const maxDonationGoalProgressBarWidth = 431

export class DonationChallengeProgressbar extends Phaser.GameObjects.Rectangle {
	constructor(scene: Phaser.Scene, x: number, y: number, state: DonationChallengeState, name: string, color: number) {
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
