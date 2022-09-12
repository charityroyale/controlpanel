import { DonationWidgetState } from '@pftp/common'

export class DonationWidgetProgressBarText extends Phaser.GameObjects.Text {
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
		this.name = donationWidgetProgressBarTextName
		this.setOrigin(1, 0.5)
		this.setScale(state.scale)
		scene.add.existing(this)
	}
}

const defaultStyles = {
	fontFamily: 'Saira Condensed',
	fontSize: '18px',
	color: '#BA4D76',
	align: 'right',
}

export const donationWidgetProgressBarTextName = 'donationWidgetProgressBarText'
