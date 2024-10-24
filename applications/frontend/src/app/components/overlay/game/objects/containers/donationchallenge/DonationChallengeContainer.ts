import {
	DONATION_CHALLENGE_UPDATE,
	DonationChallengeRootDTO,
	DonationChallengeState,
	MakeAWishInfoJsonDTO,
	SocketEventsMap,
} from '@cp/common'
import { Socket } from 'socket.io-client'
import {
	DonationChallengeProgressbar,
	donationChallengeProgressBarName,
	maxDonationGoalProgressBarWidth,
} from './DonationChallengeProgressbar'
import { formatMoney, getPercentage } from '../../../../../../lib/utils'
import { LuckiestGuyText } from '../../common/LuckiestGuyText'
import { SairaCondensedText } from '../../common/SairaCondensedText'

export class DonationChallengeContainer extends Phaser.GameObjects.Container {
	constructor(
		scene: Phaser.Scene,
		state: DonationChallengeState,
		socket: Socket<SocketEventsMap>, // TODO: feature requirements
		options: ContainerOptions | undefined
	) {
		super(scene, options?.x, options?.y, options?.children)
		this.name = donationGoalContainerName
		this.setScale(2)
		this.setScale(state.scale)
		this.setSize(maxDonationGoalProgressBarWidth, 30)
		this.setIsVisible(state.isVisible)
		this.setPosition(1920 / 2, 100)

		this.setInteractive({ cursor: 'pointer' })
		this.on('dragend', () => {
			socket.emit(DONATION_CHALLENGE_UPDATE, {
				position: {
					x: this.x,
					y: this.y,
				},
			})
		})

		this.handleState(state)
		scene.add.existing(this)
	}

	public handleState(state: DonationChallengeState) {
		// get it invisible until, first challenge

		this.setIsVisible(state.isVisible)

		if (this.x !== state.position.x || this.y !== state.position.y) {
			this.x = state.position.x
			this.y = state.position.y
		}

		if (this.scale != state.scale) {
			this.setScale(state.scale)
			this.scaleContainerItems(state)
		}

		this.updateChallengeLabel(`🎯DonationChallenge`)
		this.updateProgressBarAndStatsText(state)
		this.updateTimer('Ziel bis 19:00')
		this.updateTitle('Rezept Testgulasch')
		this.updateDescription('Rezept Testgulasch Rezept Testgulasch Rezept Testgulasch Rezept Testgulasch ')
	}

	updateTimer(timerText: string) {
		const donationChallengeTimerText = this.getByName('donationChallengeTimerText') as LuckiestGuyText
		donationChallengeTimerText.setText(timerText)
		donationChallengeTimerText.setX(this.displayWidth - 280 * this.scale)
		donationChallengeTimerText.setY(-5 * this.scale)
	}

	updateChallengeLabel(labelText: string) {
		const progressBarTitleText = this.getByName('donationChallengeProgressBarTitleText') as SairaCondensedText
		progressBarTitleText.setText(labelText)
		progressBarTitleText.setX(this.displayWidth - 645 * this.scale)
		progressBarTitleText.setY(-15 * this.scale)
	}

	updateTitle(titleText: string) {
		const progressBarHashTagText = this.getByName('donationChallengeProgressBarHashTagText') as LuckiestGuyText
		progressBarHashTagText.setText(titleText)
		progressBarHashTagText.setX(this.displayWidth - 640 * this.scale)
		progressBarHashTagText.setY(15 * this.scale)
	}

	updateDescription(descriptionText: string) {
		const donationChallengeDescriptionText = this.getByName('donationChallengeDescriptionText') as LuckiestGuyText
		donationChallengeDescriptionText.setText(descriptionText)
		donationChallengeDescriptionText.setX(this.displayWidth - 640 * this.scale)
		donationChallengeDescriptionText.setY(33 * this.scale)
	}

	scaleContainerItems = (state: DonationChallengeState) => {
		const containerItems = this.getAll() as DonationChallengeProgressbar[]
		containerItems.map((items) => items.setScale(state.scale))
	}

	setIsVisible(visible: boolean) {
		if (this.visible === visible) return
		this.visible = visible
	}

	calcProgress(donationGoalUpdate: Partial<DonationChallengeState>) {
		const donationSum = donationGoalUpdate.data?.current ?? 0
		const donationPercentageProgress = Number(
			getPercentage(donationSum / 100, donationGoalUpdate.data?.goal ?? 100).toFixed(2)
		)
		const progressBarWidth = (maxDonationGoalProgressBarWidth / 100) * donationPercentageProgress

		return {
			donationSum,
			donationPercentageProgress,
			progressBarWidth:
				progressBarWidth > maxDonationGoalProgressBarWidth ? maxDonationGoalProgressBarWidth : progressBarWidth,
		}
	}

	updateProgressBarAndStatsText(donationGoalUpdate: Partial<DonationChallengeState>) {
		const progressBar = this.getByName(donationChallengeProgressBarName) as DonationChallengeProgressbar
		const progress = this.calcProgress(donationGoalUpdate)
		progressBar.width = progress.progressBarWidth

		const progressBarText = this.getByName('donationChallengeProgressBarText') as SairaCondensedText
		progressBarText.setText(
			`${formatMoney(progress.donationSum)}€ (${progress.donationPercentageProgress}% von ${formatMoney(donationGoalUpdate.data?.goal, true)}€)`
		)

		progressBarText.setX(this.displayWidth - 230 * this.scale)
		progressBarText.setY(15 * this.scale)
	}

	updateChallengeData(challengeData: DonationChallengeRootDTO) {
		// this.updateChallengeLabel(`🎯DonationChallenge`)
		this.updateProgressBarAndStatsText({
			data: { current: challengeData.current_amount_net, goal: challengeData.amount },
		})

		const startDate = new Date(challengeData.start * 1000)
		const targetDate = new Date(startDate.getTime() + challengeData.max_time * 60 * 1000)
		const formattedDate = new Intl.DateTimeFormat('de-AT', {
			timeStyle: 'short',
		}).format(targetDate)

		this.updateTimer(`Ziel bis ${formattedDate}`)
		this.updateTitle(challengeData.title)
		this.updateDescription(challengeData.description)
	}

	handleMawJsonStateUpdate = (mawJsonInfo: MakeAWishInfoJsonDTO, streamer: string) => {
		const allStreamers = mawJsonInfo.streamers

		if (allStreamers[streamer]) {
			const active_challenge = allStreamers[streamer].active_challenge
			if (!active_challenge) {
				this.setVisible(false)
			} else {
				this.setVisible(true)
				this.updateChallengeData(active_challenge)
			}
		}
	}
}

interface ContainerOptions {
	x?: number | undefined
	y?: number | undefined
	children?: Phaser.GameObjects.GameObject[] | undefined
}

export const donationGoalContainerName = 'donationChallengeContainer'
