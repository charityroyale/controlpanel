import { DonationWidgetState } from '@pftp/common'
import { TextStyle } from '../../../config/text'

export class DonationWidgetWishTopDonation extends Phaser.GameObjects.Text {
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		state: DonationWidgetState,
		text: string | string[],
		style: TextStyle = textStyle
	) {
		super(scene, x, y, text, style)
		this.name = donationWidgetWishTopDonationName
		this.setOrigin(0.5, 0.5)
		this.setScale(state.scale)
		scene.add.existing(this)
	}
}

const textStyle: TextStyle = {
	fontFamily: 'Saira Condensed',
	fontSize: '18px',
	color: '#FFFFFF',
	align: 'center',
}

export const donationWidgetWishTopDonationName = 'donationWidgetWishTopDonation'
