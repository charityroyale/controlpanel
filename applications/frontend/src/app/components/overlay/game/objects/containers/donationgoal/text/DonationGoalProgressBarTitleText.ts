import { DonationGoalState } from '@cp/common'
import { TextStyle } from '../../../config/text'

export class DonationGoalProgressBarTitleText extends Phaser.GameObjects.Text {
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		state: DonationGoalState,
		text: string | string[],
		style: TextStyle = textStyle
	) {
		super(scene, x, y, text, style)
		this.name = donationGoalProgressBarTitleTextname
		this.setOrigin(0, 0.5)
		this.setResolution(3)
		this.setScale(state.scale)
		scene.add.existing(this)
	}
}

const textStyle: TextStyle = {
	fontFamily: 'Luckiest Guy',
	fontSize: '18px',
	color: '#FFFFFF',
	align: 'right',
}

export const donationGoalProgressBarTitleTextname = 'donationGoalProgressBarTitleTextname'
