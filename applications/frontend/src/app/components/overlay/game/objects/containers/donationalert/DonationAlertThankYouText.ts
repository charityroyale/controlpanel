import { fadeInDonationText } from '../../tweens/fadeInDonationText'
import { fadeOutDonationText } from '../../tweens/fadeOutDonationText'

const defaultStyles = {
	fontFamily: 'Saira Condensed',
	fontSize: '34px',
	color: '#BA4D76',
	align: 'center',
}

export class DonationAlertThankYouText extends Phaser.GameObjects.Text {
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		style: Phaser.Types.GameObjects.Text.TextStyle = defaultStyles
	) {
		super(scene, x, y, 'Danke für deine Spende!', style)
		this.setColor('#FFFFFF')
		this.name = 'donationalerttext'
		this.setOrigin(0.5)
		this.alpha = 0
		fadeInDonationText(scene, this)
		fadeOutDonationText(scene, this, () => this.destroy())
		scene.add.existing(this)
	}
}
