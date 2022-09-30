import { DonationWidgetState } from '@cp/common'
import { TextStyle } from '../../../config/text'

export const donationWidgetLoaderFrameTextName = 'donationWidgetLoaderFrameText'
export class DonationWidgetLoaderFrameText extends Phaser.GameObjects.Text {
	constructor(scene: Phaser.Scene, x: number, y: number, text: string, state: DonationWidgetState) {
		super(scene, x, y, text, textStyle)
		this.name = donationWidgetLoaderFrameTextName
		this.setOrigin(0.5, 0.5)
		this.setResolution(3)
		this.setScale(state.scale)

		this.scene.add.existing(this)
	}
}

const textStyle: TextStyle = {
	fontFamily: 'Saira Condensed',
	fontSize: '18px',
	color: '#FFFFFF',
	align: 'right',
}
