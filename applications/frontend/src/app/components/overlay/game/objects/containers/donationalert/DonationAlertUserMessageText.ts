import { fadeInDonationText } from '../../tweens/fadeInDonationText'
import { fadeOutDonationText } from '../../tweens/fadeOutDonationText'
import { DonationAlertContainer } from './DonationAlertContainer'

const defaultStyles = {
	fontFamily: 'Saira Condensed',
	fontSize: '34px',
	color: '#BA4D76',
	align: 'center',
}

export class DonationAlertUserMessageText extends Phaser.GameObjects.Text {
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		text: string,
		style: Phaser.Types.GameObjects.Text.TextStyle = defaultStyles
	) {
		super(scene, x, y, text, style)
		this.setColor('#FFFFFF')
		this.setWordWrapWidth(
			(this.scene.children.getByName('donationalertcontainer') as DonationAlertContainer).width - 20
		)
		this.name = 'donationalerttext'
		this.setOrigin(0.5, 0)
		this.alpha = 0
		fadeInDonationText(scene, this)
		fadeOutDonationText(scene, this, () => this.destroy())
		scene.add.existing(this)
	}
}
