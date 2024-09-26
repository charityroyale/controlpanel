import { DonationWidgetState, MakeAWishRootLevelWishDTO } from '@cp/common'
import { getPercentage } from '../../../../../../lib/utils'

const maxProgressBarWidth = 431
export class DonationWidgetProgressBar extends Phaser.GameObjects.Rectangle {
	constructor(scene: Phaser.Scene, x: number, y: number, state: DonationWidgetState, name: string, color: number) {
		super(scene, x, y, maxProgressBarWidth, 30, color)
		this.name = name
		this.setOrigin(0, 0.5)
		this.setScale(state.scale)

		scene.add.existing(this)
	}

	public calcProgress(wishInfo: MakeAWishRootLevelWishDTO | undefined) {
		if (!wishInfo) {
			return {
				donationSum: 0,
				donationGoal: 0,
				donationPercentageProgress: 0,
				progressBarWidth: 0,
			}
		}

		const donationSum = Number(wishInfo.current_donation_sum_net) / 100
		const donationGoal = Number(wishInfo.donation_goal)
		const donationPercentageProgress = Number(getPercentage(donationSum, donationGoal / 100).toFixed(2))
		const progressBarWidth = (maxProgressBarWidth / 100) * donationPercentageProgress

		return {
			donationSum,
			donationGoal,
			donationPercentageProgress,
			progressBarWidth: progressBarWidth > maxProgressBarWidth ? maxProgressBarWidth : progressBarWidth,
		}
	}

	public updateWidth(wishInfo: MakeAWishRootLevelWishDTO | undefined) {
		this.width = this.calcProgress(wishInfo).progressBarWidth
	}
}

export const donationWidgetProgressBarBackgroundName = 'donationWidgetProgressBarBackground'
export const donationWidgetProgressBarName = 'donationWidgetProgressBar'
