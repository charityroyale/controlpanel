import { DonationWidgetState } from '@cp/common'
import { TextStyle } from '../../../config/text'

export class DonationWidgetWishSubHeading extends Phaser.GameObjects.Text {
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		state: DonationWidgetState,
		text: string | string[],
		style: TextStyle = textStyle
	) {
		super(scene, x, y, text, style)
		this.name = donationWidgetWishSubHeadingName
		this.setOrigin(1, 0)
		this.setScale(state.scale)
		scene.add.existing(this)
	}
}

const textStyle: TextStyle = {
	fontFamily: 'Luckiest Guy',
	fontSize: '24px',
	color: '#FFFFFF',
	align: 'right',
}

export const donationWidgetWishSubHeadingName = 'donationWidgetWishSubHeading'
