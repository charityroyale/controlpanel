import { DonationGoalState, SocketEventsMap, DONATION_GOAL_UPDATE, MakeAWishStreamerDTO } from '@cp/common'
import { Socket } from 'socket.io-client'
import {
	DonationGoalProgressbar,
	donationGoalProgressBarName,
	maxDonationGoalProgressBarWidth,
} from './DonationGoalProgressbar'
import { getPercentage } from '../../../../../../lib/utils'
import { DonationGoalProgressBarText, donatioGoalProgressBarTextName } from './text/DonationGoalProgressBarText'
import {
	DonationGoalProgressBarTitleText,
	donationGoalProgressBarTitleTextname,
} from './text/DonationGoalProgressBarTitleText'

export class DonationGoalContainer extends Phaser.GameObjects.Container {
	private donationGoal = 0
	private donationPercentageProgress = 0
	private donationSum = 0

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
		}

		const progressBarTitleText = this.getByName(
			donationGoalProgressBarTitleTextname
		) as DonationGoalProgressBarTitleText
		progressBarTitleText.setX(this.displayWidth - 645 * this.scale)
		progressBarTitleText.setY(-15 * this.scale)

		this.donationGoal = state.data.goal

		const progressBarText = this.getByName(donatioGoalProgressBarTextName) as DonationGoalProgressBarText
		progressBarText.setX(this.displayWidth - 230 * this.scale)
		progressBarText.setY(15 * this.scale)
	}

	private scaleContainerItems = (state: DonationGoalState) => {
		const containerItems = this.getAll() as DonationGoalProgressbar[]
		containerItems.map((items) => items.setScale(state.scale))
	}

	public setIsVisible(visible: boolean) {
		if (this.visible === visible) return
		this.visible = visible
	}

	public calcProgress(totalDonationSumNetCollected = 0) {
		const donationSum = this.donationSum > 0 ? this.donationSum : totalDonationSumNetCollected
		const donationPercentageProgress = Number(getPercentage(donationSum, this.donationGoal).toFixed(2))
		const progressBarWidth = (maxDonationGoalProgressBarWidth / 100) * donationPercentageProgress

		return {
			donationSum,
			donationPercentageProgress,
			progressBarWidth:
				progressBarWidth > maxDonationGoalProgressBarWidth ? maxDonationGoalProgressBarWidth : progressBarWidth,
		}
	}

	public updateProgress(streamerInfo: MakeAWishStreamerDTO) {
		const progressBar = this.getByName(donationGoalProgressBarName) as DonationGoalProgressbar
		const progress = this.calcProgress(Number(streamerInfo.current_donation_sum_net))
		progressBar.width = progress.progressBarWidth
		this.donationSum = progress.donationSum
		this.donationPercentageProgress = progress.donationPercentageProgress

		this.updateText()
	}

	private updateText() {
		const progressBarText = this.getByName(donatioGoalProgressBarTextName) as DonationGoalProgressBarText

		progressBarText.setText(`${this.donationSum}€ (${this.donationPercentageProgress}% von ${this.donationGoal}€)`)
	}
}

interface ContainerOptions {
	x?: number | undefined
	y?: number | undefined
	children?: Phaser.GameObjects.GameObject[] | undefined
}

export const donationGoalContainerName = 'donationgoalcontainer'