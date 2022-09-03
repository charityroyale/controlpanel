import { DonationAlertState } from '@pftp/common'
import { DonationBannerContainer } from './DonationBannerContainer'

/**
 * Videobackgroundanimation GameObject
 */
export class DonationAlertBanner extends Phaser.GameObjects.Video {
	constructor(scene: Phaser.Scene, x: number, y: number, state: DonationAlertState, key: string) {
		super(scene, x, y, key)
		this.name = key
		this.setOrigin(0.5, 0)
		this.alpha = 0
		this.setScale(state.scale)

		this.on('complete', () => {
			const donationAlertContainer = this.parentContainer as DonationBannerContainer
			if (donationAlertContainer) {
				donationAlertContainer.alpha = 0
			}
		})

		this.scene.add.existing(this)
	}
}
