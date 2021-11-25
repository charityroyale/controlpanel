import { DonationAlertState } from '@pftp/common'
import { donationAlertKey, donationAlertWithMessageKey } from '../../../scenes/OverlayScene'
import { DonationAlertHeaderText } from './DonationAlertHeaderText'
import { DonationAlertUserMessageText } from './DonationAlertUserMessageText'
import { DonationAlert } from './DonationBanner'

interface ContainerOptions {
	x?: number | undefined
	y?: number | undefined
	children?: Phaser.GameObjects.GameObject[] | undefined
}

export class DonationAlertContainer extends Phaser.GameObjects.Container {
	constructor(scene: Phaser.Scene, state: DonationAlertState, options: ContainerOptions | undefined) {
		super(scene, options?.x, options?.y, options?.children)
		this.name = 'donationalertcontainer'
		this.setDisplaySize(500, 500)
		this.setScale(state.scale)
		this.setIsVisible(state.isVisible)
		this.setPosition(1920 / 2, 100)

		this.handleState(state)
		scene.add.existing(this)
	}

	public handleState(state: DonationAlertState) {
		this.setIsVisible(state.isVisible)

		if (this.scale != state.scale) {
			this.setScale(state.scale)
			const banners = this.getAll() as DonationAlert[]
			banners.map((el) => el.setScale(state.scale))

			const el = this.getByName('donationalerttext') as DonationAlertHeaderText

			const banner = this.getByName(donationAlertKey) as DonationAlert
			if (banner && el) {
				el.setY(banner.displayHeight - 240 * this.scale)
			}

			const bannerWithMessage = this.getByName(donationAlertWithMessageKey) as DonationAlert
			const messageText = this.getByName('donationalertmessagetext') as DonationAlertUserMessageText
			if (bannerWithMessage && messageText) {
				el.setY(banner.displayHeight - 240 * this.scale)
				messageText.setPosition(
					bannerWithMessage.x - (bannerWithMessage.displayWidth / 2 - 50),
					bannerWithMessage.displayHeight - 540 * this.scale
				)
			}
		}
	}

	public setIsVisible(visible: boolean) {
		if (this.visible === visible) return
		this.visible = visible
	}
}
