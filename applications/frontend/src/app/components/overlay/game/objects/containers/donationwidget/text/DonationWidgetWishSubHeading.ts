import { DonationWidgetState } from '@pftp/common'

export class DonationWidgetWishSubHeading extends Phaser.GameObjects.Text {
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
		this.name = donationWidgetWishSubHeadingName
		this.setOrigin(1, 0)
		this.setScale(state.scale)
		scene.add.existing(this)
	}
}

const defaultStyles = {
	fontFamily: 'Luckiest Guy',
	fontSize: '24px',
	color: '#BA4D76',
	align: 'right',
}

export const donationWidgetWishSubHeadingName = 'donationWidgetWishSubHeading'
