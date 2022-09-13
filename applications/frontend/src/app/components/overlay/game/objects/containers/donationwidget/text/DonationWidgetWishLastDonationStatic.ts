import { DonationWidgetState } from '@pftp/common'
import { TextStyle } from '../../../config/text'

export class DonationWidgetWishLastDonationStatic extends Phaser.GameObjects.Text {
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		state: DonationWidgetState,
		text: string | string[],
		style: TextStyle = textStyle
	) {
		super(scene, x, y, text, style)
		this.name = donationWidgetWishLastDonationStaticName
		this.setOrigin(-1, -4.4)
		this.setScale(state.scale)
		scene.add.existing(this)
	}
}

const textStyle: TextStyle = {
	fontFamily: 'Luckiest Guy',
	fontSize: '18px',
	color: '#FFFFFF',
	align: 'center',
}

export const donationWidgetWishLastDonationStaticName = 'donationWidgetWishLastDonationStatic'
