import { DonationAlertState, DONATION_ALERT_UPDATE, SocketEventsMap } from '@cp/common'
import { Socket } from 'socket.io-client'
import { donationAlertKey, donationAlertWithMessageKey } from '../../../scenes/OverlayScene'
import { DonationBannerHeaderText, donationAlertHeaderTextName } from './DonationBannerHeaderText'
import { DonationBannerMessageText, donationAlertUserMessageTextName } from './DonationBannerMessageText'
import { DonationAlertBanner } from './DonationBanner'

/**
 * Container for visual AlertContainer
 * - Header / Text
 * - Message / Text
 * - BackgroundBanner / Video
 */
export class DonationBannerContainer extends Phaser.GameObjects.Container {
	constructor(
		scene: Phaser.Scene,
		state: DonationAlertState,
		socket: Socket<SocketEventsMap>,
		options: ContainerOptions | undefined
	) {
		super(scene, options?.x, options?.y, options?.children)
		this.name = donationAlertContainerName
		this.setSize(500, 900)
		this.setScale(state.scale)
		this.setIsVisible(state.isVisible)
		this.setPosition(1920 / 2, 100)
		this.setInteractive({ cursor: 'pointer' })
		this.on('dragend', () => {
			socket.emit(DONATION_ALERT_UPDATE, {
				position: {
					x: this.x,
					y: this.y,
				},
			})
		})

		this.handleState(state)
		scene.add.existing(this)
	}

	public handleState(state: DonationAlertState) {
		this.setIsVisible(state.isVisible)

		if (this.x !== state.position.x || this.y !== state.position.y) {
			this.x = state.position.x
			this.y = state.position.y
		}

		if (this.scale != state.scale) {
			this.setScale(state.scale)
			this.scaleContainerItems(state)

			this.scaleDonationHeaderText()
			this.scaleDonationUserMessageText()
		}
	}

	private scaleContainerItems = (state: DonationAlertState) => {
		const containerItems = this.getAll() as DonationAlertBanner[]
		containerItems.map((items) => items.setScale(state.scale))
	}

	private scaleDonationHeaderText = () => {
		const donationAlertHeaderText = this.getByName(donationAlertHeaderTextName) as DonationBannerHeaderText
		const donationAlert = this.getByName(donationAlertKey) as DonationAlertBanner

		if (donationAlert && donationAlertHeaderText) {
			donationAlertHeaderText.setY(donationAlert.displayHeight - 240 * this.scale)
		}
	}

	private scaleDonationUserMessageText = () => {
		const donationAlertHeaderText = this.getByName(donationAlertHeaderTextName) as DonationBannerHeaderText
		const donationAlert = this.getByName(donationAlertKey) as DonationAlertBanner
		const bannerWithMessage = this.getByName(donationAlertWithMessageKey) as DonationAlertBanner
		const donationAlertUserMessageText = this.getByName(donationAlertUserMessageTextName) as DonationBannerMessageText

		if (bannerWithMessage && donationAlertUserMessageText && donationAlert && donationAlertHeaderText) {
			donationAlertHeaderText.setY(donationAlert.displayHeight - 240 * this.scale)
			donationAlertUserMessageText.setPosition(
				bannerWithMessage.x - (bannerWithMessage.displayWidth / 2 - 50),
				bannerWithMessage.displayHeight - 540 * this.scale
			)
			donationAlertUserMessageText.setWordWrapWidth(
				donationAlert.displayWidth - 70 * bannerWithMessage.parentContainer.scale * 2
			)
		}
	}

	public setIsVisible(visible: boolean) {
		if (this.visible === visible) return
		this.visible = visible
	}
}

interface ContainerOptions {
	x?: number | undefined
	y?: number | undefined
	children?: Phaser.GameObjects.GameObject[] | undefined
}

export const donationAlertContainerName = 'donationalertcontainer'
