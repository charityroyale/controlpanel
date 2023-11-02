import { DonationGoalState, SocketEventsMap, DONATION_GOAL_UPDATE } from '@cp/common'
import { Socket } from 'socket.io-client'
import { DonationGoalProgressbar } from './DonationGoalProgressbar'

export class DonationGoalContainer extends Phaser.GameObjects.Container {
	constructor(
		scene: Phaser.Scene,
		state: DonationGoalState,
		socket: Socket<SocketEventsMap>,
		options: ContainerOptions | undefined
	) {
		super(scene, options?.x, options?.y, options?.children)
		this.name = donationGoalContainerName
		this.setSize(500, 900)
		this.setScale(state.scale)
		this.setIsVisible(state.isVisible)
		this.setPosition(1920 / 2, 100)
		this.setInteractive({ cursor: 'pointer' })
		this.on('dragend', () => {
			socket.emit(DONATION_GOAL_UPDATE, {
				position: {
					x: this.x,
					y: this.y,
				},
			})
		})

		this.handleState(state)
		scene.add.existing(this)
	}

	public handleState(state: DonationGoalState) {
		console.log(state.isVisible)
		this.setIsVisible(state.isVisible)

		if (this.x !== state.position.x || this.y !== state.position.y) {
			this.x = state.position.x
			this.y = state.position.y
		}

		if (this.scale != state.scale) {
			this.setScale(state.scale)
			this.scaleContainerItems(state)

			//this.scaleDonationHeaderText()
			//this.scaleDonationUserMessageText()
		}
	}

	private scaleContainerItems = (state: DonationGoalState) => {
		const containerItems = this.getAll() as DonationGoalProgressbar[]
		containerItems.map((items) => items.setScale(state.scale))
	}

	/* private scaleDonationHeaderText = () => {
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
	}*/

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

export const donationGoalContainerName = 'donationgoalcontainer'
