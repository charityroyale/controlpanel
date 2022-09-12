import { DonationWidgetState } from '@pftp/common'

export class DonationWidgetWishTopDonationStatic extends Phaser.GameObjects.Text {
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		state: DonationWidgetState,
		text: string | string[],
		style: Phaser.Types.GameObjects.Text.TextStyle = defaultStyles
	) {
		super(scene, x, y, text, style)
		this.setColor('#FFFFFF')
		this.name = donationWidgetWishTopDonationStaticName
		this.setOrigin(0.5, -4.4)
		this.setScale(state.scale)
		scene.add.existing(this)
	}
}

const defaultStyles = {
	fontFamily: 'Luckiest Guy',
	fontSize: '18px',
	color: '#BA4D76',
	align: 'center',
}

export const donationWidgetWishTopDonationStaticName = 'donationWidgetWishTopDonationStatic'
