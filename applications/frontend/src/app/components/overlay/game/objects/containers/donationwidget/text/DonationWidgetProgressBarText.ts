import { DonationWidgetState } from '@cp/common'
import { TextStyle } from '../../../config/text'

export class DonationWidgetProgressBarText extends Phaser.GameObjects.Text {
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		state: DonationWidgetState,
		text: string | string[],
		style: TextStyle = textStyle
	) {
		super(scene, x, y, text, style)
		this.name = donationWidgetProgressBarTextName
		this.setOrigin(1, 0.5)
		this.setResolution(3)
		this.setScale(state.scale)
		scene.add.existing(this)
	}
}

const textStyle: TextStyle = {
	fontFamily: 'Saira Condensed',
	fontSize: '18px',
	color: '#FFFFFF',
	align: 'right',
}

export const donationWidgetProgressBarTextName = 'donationWidgetProgressBarText'
