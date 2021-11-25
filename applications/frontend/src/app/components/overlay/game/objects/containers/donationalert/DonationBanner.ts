import { DonationAlertState } from '@pftp/common'
import { DonationAlertContainer } from './DonationAlertContainer'

export class DonationAlert extends Phaser.GameObjects.Video {
	constructor(scene: Phaser.Scene, x: number, y: number, state: DonationAlertState, key: string) {
		super(scene, x, y, key)
		this.name = key
		this.setOrigin(0.5, 0)
		this.alpha = 0
		this.setScale(state.scale)

		this.on('complete', () => {
			const donationAlertContainer = this.parentContainer as DonationAlertContainer
			if (donationAlertContainer) {
				donationAlertContainer.alpha = 0
			}
		})

		this.scene.add.existing(this)
	}
}
