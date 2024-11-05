import {
	DONATION_CHALLENGE_UPDATE,
	DonationChallengeRootDTO,
	DonationChallengeState,
	MakeAWishInfoJsonDTO,
	SocketEventsMap,
} from '@cp/common'
import { Socket } from 'socket.io-client'
import { DonationChallengeProgressbar, maxDonationGoalProgressBarWidth } from './DonationChallengeProgressbar'
import { formatMoney, getPercentage } from '../../../../../../lib/utils'
import { LuckiestGuyText } from '../../common/LuckiestGuyText'
import { SairaCondensedText } from '../../common/SairaCondensedText'

export class DonationChallengeContainer extends Phaser.GameObjects.Container {
	initialized: boolean = false
	cpState: DonationChallengeState

	donationChallengeProgressBarBackground!: DonationChallengeProgressbar
	donationChallengeProgressBar!: DonationChallengeProgressbar
	donationChallengeProgressBarText!: SairaCondensedText
	donationChallengeProgressBarTitleText!: LuckiestGuyText
	donationChallengeProgressBarHashTagText!: LuckiestGuyText
	donationChallengeDescriptionText!: LuckiestGuyText

	constructor(
		scene: Phaser.Scene,
		state: DonationChallengeState,
		socket: Socket<SocketEventsMap> // TODO: feature requirements
	) {
		super(scene)
		this.name = donationChallengeContainerName
		this.cpState = state

		this.create()
		this.add([
			this.donationChallengeProgressBarBackground,
			this.donationChallengeProgressBar,
			this.donationChallengeProgressBarText,
			this.donationChallengeProgressBarTitleText,
			this.donationChallengeProgressBarHashTagText,
			this.donationChallengeDescriptionText,
		])

		this.setScale(2)
		this.setScale(state.scale)
		this.setSize(maxDonationGoalProgressBarWidth, 30)
		this.setIsVisible(false)
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

	create() {
		this.donationChallengeProgressBarBackground = new DonationChallengeProgressbar(
			this.scene,
			0,
			0,
			this.cpState,
			0x2b067a
		)

		this.donationChallengeProgressBar = new DonationChallengeProgressbar(this.scene, 0, 0, this.cpState, 0xc03be4)

		this.donationChallengeProgressBarText = new SairaCondensedText(
			this.scene,
			0,
			0,
			this.cpState,
			'Placeholder',
			'donationChallengeProgressBarText'
		)

		this.donationChallengeProgressBarTitleText = new LuckiestGuyText(
			this.scene,
			0,
			0,
			this.cpState,
			`Placeholder`,
			'donationChallengeProgressBarTitleText'
		)

		this.donationChallengeProgressBarHashTagText = new LuckiestGuyText(
			this.scene,
			0,
			0,
			this.cpState,
			'Placeholder',
			'donationChallengeProgressBarHashTagText',
			{ fontSize: '14px' }
		)

		this.donationChallengeDescriptionText = new LuckiestGuyText(
			this.scene,
			0,
			0,
			this.cpState,
			'Placeholder',
			'donationChallengeDescriptionText',
			{ fontSize: '12px', align: 'left' }
		)
			.setWordWrapWidth(maxDonationGoalProgressBarWidth)
			.setOrigin(0, 0)
	}

	public handleState(state: DonationChallengeState) {
		if (this.x !== state.position.x || this.y !== state.position.y) {
			this.x = state.position.x
			this.y = state.position.y
		}

		if (this.scale != state.scale) {
			this.setScale(state.scale)
			this.scaleContainerItems(state)
		}

		if (!this.initialized) {
			this.updateChallengeLabel(`🎯DonationChallenge`)
			this.updateProgressBarAndStatsText(state)
			this.updateTitle('Challenge')
			this.updateDescription('Hier könnte eine Challenge stehen!')
			this.initialized = true
		} else {
			this.updateChallengeLabel()
			this.updateProgressBarAndStatsText()
			this.updateTitle()
			this.updateDescription()
			this.initialized = true
		}
	}

	updateChallengeLabel(labelText?: string) {
		if (labelText) {
			this.donationChallengeProgressBarTitleText.setText(labelText)
		}
		this.donationChallengeProgressBarTitleText.setPosition(this.displayWidth - 645 * this.scale, -15 * this.scale)
	}

	updateTitle(titleText?: string) {
		if (titleText) {
			this.donationChallengeProgressBarHashTagText.setText(titleText)
		}
		this.donationChallengeProgressBarHashTagText.setPosition(this.displayWidth - 640 * this.scale, 15 * this.scale)
	}

	updateDescription(descriptionText?: string) {
		if (descriptionText) {
			this.donationChallengeDescriptionText.setText(descriptionText)
		}

		this.donationChallengeDescriptionText.setPosition(this.displayWidth - 640 * this.scale, 33 * this.scale)
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

	updateProgressBarAndStatsText(donationGoalUpdate?: Partial<DonationChallengeState>) {
		if (donationGoalUpdate) {
			const progress = this.calcProgress(donationGoalUpdate)
			this.donationChallengeProgressBar.width = progress.progressBarWidth
			this.donationChallengeProgressBarText.setText(
				`${formatMoney(progress.donationSum)}€ (${progress.donationPercentageProgress}% von ${formatMoney(donationGoalUpdate.data?.goal, true)}€)`
			)
		}
		this.donationChallengeProgressBarText.setPosition(this.displayWidth - 230 * this.scale, 15 * this.scale)
	}

	updateChallengeData(challengeData: DonationChallengeRootDTO) {
		if (!challengeData) {
			return
		}

		if (challengeData.status === 'running') {
			this.updateChallengeLabel(`🎯DonationChallenge`)
		} else if (challengeData.status === 'completed') {
			this.updateChallengeLabel(`✅DonationChallenge`)
		} else if (challengeData.status === 'failed') {
			this.updateChallengeLabel(`😔DonationChallenge`)
		}

		this.updateProgressBarAndStatsText({
			data: { current: challengeData.current_amount_net, goal: challengeData.amount / 100 },
		})

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
				const activeChallengeForStreamer = mawJsonInfo.challenges[`${active_challenge}`]
				if (activeChallengeForStreamer) {
					this.setVisible(true)
					this.updateChallengeData(mawJsonInfo.challenges[`${active_challenge}`])
				} else {
					this.setVisible(false)
				}
			}
		}
	}
}

export const donationChallengeContainerName = 'donationChallengeContainer'
