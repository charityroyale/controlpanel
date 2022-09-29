import { DonationWidgetState } from '@cp/common'
import { CHARITY_ROYALE_LOGO_IMAGE_KEY, MAKE_A_WISH_LOGO_IMAGE_KEY } from '../../../scenes/OverlayScene'

export const donationWidgetLogoName = 'donationWidgetLogo'

const textureSwapInterval = 60000 // ms
export class DonationWidgetLogo extends Phaser.GameObjects.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number, state: DonationWidgetState) {
		super(scene, x, y, CHARITY_ROYALE_LOGO_IMAGE_KEY)
		this.name = donationWidgetLogoName
		this.setOrigin(0, 0.5)
		this.setScale(state.scale)
		this.scene.add.existing(this)
		this.startRotateTexture()
	}

	private startRotateTexture() {
		this.scene.time.addEvent({
			delay: textureSwapInterval,
			callback: () => this.swapTexture(),
			loop: true,
		})
	}

	private swapTexture() {
		if (this.texture.key === CHARITY_ROYALE_LOGO_IMAGE_KEY) {
			this.setTexture(MAKE_A_WISH_LOGO_IMAGE_KEY)
		} else {
			this.setTexture(CHARITY_ROYALE_LOGO_IMAGE_KEY)
		}
	}
}
