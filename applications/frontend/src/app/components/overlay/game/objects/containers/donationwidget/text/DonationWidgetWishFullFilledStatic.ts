import { DonationWidgetState } from '@pftp/common'
import { TextStyle } from '../../../config/text'

// start
export class DonationWidgetPrefixTextStatic extends Phaser.GameObjects.Text {
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		state: DonationWidgetState,
		text: string | string[],
		style: TextStyle = textStyle
	) {
		super(scene, x, y, text, style)
		this.name = donationWidgetPrefixTextStaticName
		this.setOrigin(0, 0.5)
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

export const donationWidgetPrefixTextStaticName = 'donationWidgetPrefixTextStatic'

// middle
export class DonationWidgetMiddleTextStatic extends Phaser.GameObjects.Text {
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		state: DonationWidgetState,
		text: string | string[],
		style: TextStyle = textStyleDonationWidgetMiddleTextStatic
	) {
		super(scene, x, y, text, style)
		this.name = donationWidgetMiddleTextStaticName
		this.setOrigin(0, 0.5)
		this.setScale(state.scale)
		scene.add.existing(this)
	}
}

const textStyleDonationWidgetMiddleTextStatic: TextStyle = {
	fontFamily: 'Luckiest Guy',
	fontSize: '24px',
	color: '#FFFFFF',
	align: 'center',
}

export const donationWidgetMiddleTextStaticName = 'donationWidgetMiddleTextStatic'

// postfix
export class DonationWidgetPostfixTextStatic extends Phaser.GameObjects.Text {
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		state: DonationWidgetState,
		text: string | string[],
		style: TextStyle = textStyle
	) {
		super(scene, x, y, text, style)
		this.name = donationWidgetPostfixTextStaticName
		this.setOrigin(0, 0.5)
		this.setScale(state.scale)
		scene.add.existing(this)
	}
}

export const donationWidgetPostfixTextStaticName = 'donationWidgetPostfixTextStatic'
