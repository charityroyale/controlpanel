import { fadeInDonationMessageText } from '../../tweens/fadeInDonationMessageText'
import { fadeOutDonationText } from '../../tweens/fadeOutDonationText'

/**
 * Donationmessage GameObject shown if a Donation
 * contains a message.
 */
export class DonationBannerMessageText extends Phaser.GameObjects.Text {
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		text: string,
		scale: number,
		wordWrap: number,
		style: Phaser.Types.GameObjects.Text.TextStyle = defaultStyles
	) {
		super(scene, x, y, text, style)
		this.setColor('#FFFFFF')
		this.setWordWrapWidth(wordWrap)
		this.setScale(scale)
		this.name = donationAlertUserMessageTextName
		this.setOrigin(0)
		this.alpha = 0
		fadeInDonationMessageText(scene, this)
		fadeOutDonationText(scene, this, () => this.destroy())
		scene.add.existing(this)
	}
}

const defaultStyles: Phaser.Types.GameObjects.Text.TextStyle = {
	fontFamily: 'Saira Condensed',
	fontSize: '34px',
	color: '#BA4D76',
	maxLines: 4,
}

export const donationAlertUserMessageTextName = 'donationalertmessagetext'
