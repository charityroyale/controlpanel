import { DonationGoalState, SocketEventsMap, DONATION_GOAL_UPDATE, MakeAWishStreamerDTO } from '@cp/common'
import { Socket } from 'socket.io-client'
import {
	DonationGoalProgressbar,
	donationGoalProgressBarName,
	maxDonationGoalProgressBarWidth,
} from './DonationGoalProgressbar'
import { getPercentage } from '../../../../../../lib/utils'
import { DonationGoalProgressBarText, donatioGoalProgressBarTextName } from './text/DonationGoalProgressBarText'

export class DonationGoalContainer extends Phaser.GameObjects.Container {
	constructor(
		scene: Phaser.Scene,
		state: DonationGoalState,
		socket: Socket<SocketEventsMap>,
		options: ContainerOptions | undefined
	) {
		super(scene, options?.x, options?.y, options?.children)
		this.name = donationGoalContainerName
		this.setScale(state.scale)
		this.setSize(maxDonationGoalProgressBarWidth, 30)
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

		// ProgressBar
		/*const progressBarBackground = this.getByName(donationGoalProgressBackgroundBarName) as DonationGoalProgressbar
		progressBarBackground.setX(this.displayWidth - 735 * this.scale)
		progressBarBackground.setY(164.5 * this.scale)

		const progressBar = this.getByName(donationGoalProgressBarName) as DonationGoalProgressbar
		progressBar.setX(this.displayWidth - 735 * this.scale)
		progressBar.setY(164.5 * this.scale)*/

		/* const progressBarText = this.getByName(donationWidgetProgressBarTextName) as DonationWidgetProgressBarText
		progressBarText.setX(this.displayWidth - 315 * this.scale)
		progressBarText.setY(164.5 * this.scale)*/

		const progressBarText = this.getByName(donatioGoalProgressBarTextName) as DonationGoalProgressBarText
		progressBarText.setX(this.x - this.displayWidth)
		progressBarText.setY(this.y + this.displayHeight / 2)
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

	public calcProgress(_totalDonationSumNetCollected = 0) {
		const donationSum = 250 // todo: change back to param
		const donationGoal = 500 // todo: use from globalstate donationgoalstate object value
		// todo: add text to loader
		const donationPercentageProgress = Number(getPercentage(donationSum, donationGoal).toFixed(2))
		const progressBarWidth = (maxDonationGoalProgressBarWidth / 100) * donationPercentageProgress

		return {
			donationSum,
			donationGoal,
			donationPercentageProgress,
			progressBarWidth:
				progressBarWidth > maxDonationGoalProgressBarWidth ? maxDonationGoalProgressBarWidth : progressBarWidth,
		}
	}

	public updateWidth(streamerInfo: MakeAWishStreamerDTO) {
		const progressBar = this.getByName(donationGoalProgressBarName) as DonationGoalProgressbar
		const progress = this.calcProgress(Number(streamerInfo.current_donation_sum_net))
		progressBar.width = progress.progressBarWidth

		const progressBarText = this.getByName(donatioGoalProgressBarTextName) as DonationGoalProgressBarText

		progressBarText.setText(
			`${progress.donationSum}€ (${progress.donationPercentageProgress}% von ${progress.donationGoal}€)`
		)
	}
}

interface ContainerOptions {
	x?: number | undefined
	y?: number | undefined
	children?: Phaser.GameObjects.GameObject[] | undefined
}

export const donationGoalContainerName = 'donationgoalcontainer'
