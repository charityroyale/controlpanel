import { DonationWidgetState } from '@cp/common'
import { TextStyle } from '../../../config/text'

// kidname
export class DonationWidgetWishFullFilledKidName extends Phaser.GameObjects.Text {
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		state: DonationWidgetState,
		text: string | string[],
		style: TextStyle = textStyle
	) {
		super(scene, x, y, text, style)
		this.name = donationWidgetWishFullFilledKidNameName
		this.setOrigin(0.5, 0.5)
		this.setResolution(3)
		this.setScale(state.scale)
		this.visible = false
		scene.add.existing(this)
	}
}

const textStyle: TextStyle = {
	fontFamily: 'Saira Condensed',
	fontSize: '24px',
	color: '#FFFFFF',
	align: 'center',
}

export const donationWidgetWishFullFilledKidNameName = 'donationWidgetWishFullFilledKidName'

// wishnumber
export class DonationWidgetWishFullFilledWishNumber extends Phaser.GameObjects.Text {
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		state: DonationWidgetState,
		text: string | string[],
		style: TextStyle = wishNumberText
	) {
		super(scene, x, y, text, style)
		this.name = donationWidgetWishFullFilledWishNumberName
		this.setOrigin(0.5, 0.5)
		this.setResolution(3)
		this.visible = false
		this.setScale(state.scale)
		scene.add.existing(this)
	}
}

const wishNumberText: TextStyle = {
	fontFamily: 'Luckiest Guy',
	fontSize: '18px',
	color: '#FFFFFF',
	align: 'center',
}

export const donationWidgetWishFullFilledWishNumberName = 'donationWidgetWishFullFilledWishNumber'

// wishfullfilledamount
export class DonationWidgetWishFullFilledAmount extends Phaser.GameObjects.Text {
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		state: DonationWidgetState,
		text: string | string[],
		style: TextStyle = amountTextStyle
	) {
		super(scene, x, y, text, style)
		this.name = donationWidgetWishFullFilledAmountName
		this.setOrigin(0.5, 0.5)
		this.setScale(state.scale)
		this.setResolution(3)
		this.visible = false
		scene.add.existing(this)
	}
}

const amountTextStyle: TextStyle = {
	fontFamily: 'Saira Condensed',
	fontSize: '18px',
	color: '#FFFFFF',
	align: 'center',
}

export const donationWidgetWishFullFilledAmountName = 'donationWidgetWishFullFilledAmountName'
