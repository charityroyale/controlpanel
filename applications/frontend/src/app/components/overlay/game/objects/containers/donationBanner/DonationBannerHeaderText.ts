import { TextStyle } from '../../config/text'
import { fadeInDonationText } from '../../tweens/fadeInDonationText'
import { fadeOutDonationText } from '../../tweens/fadeOutDonationText'

/**
 * Header text for DonationBanner
 */
export class DonationBannerHeaderText extends Phaser.GameObjects.Text {
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		text: string | string[],
		scale: number,
		style: TextStyle = textStyle
	) {
		super(scene, x, y, text, style)
		this.name = donationAlertHeaderTextName
		this.setOrigin(0.5)
		this.setScale(scale)
		this.alpha = 0
		fadeInDonationText(scene, this)
		fadeOutDonationText(scene, this, () => this.destroy())

		scene.add.existing(this)
	}
}

const textStyle: TextStyle = {
	fontFamily: 'Saira Condensed',
	fontSize: '48px',
	color: '#FFFFFF',
	align: 'center',
}

export const donationAlertHeaderTextName = 'donationalerttext'
