import { DonationWidgetState, DONATION_WIDGET_UPDATE, MakeAWishInfoJsonDTO, SocketEventsMap } from '@cp/common'
import { GameObjects } from 'phaser'
import { Socket } from 'socket.io-client'
import { loadTextItems } from '../../config/content'
import { DonationWidgetFullFilled, donationWidgetFullFilledName } from './DonationWidgetFullFilled'
import { DonationWidgetLoaderFrame, donationWidgetLoaderFrameName } from './DonationWidgetLoaderFrame'
import {
	DonationWidgetProgressBar,
	donationWidgetProgressBarBackgroundName,
	donationWidgetProgressBarName,
} from './DonationWidgetProgressBar'
import { donationWidgetLoaderFrameTextName, DonationWidgetLoaderFrameText } from './text/DonationWidgetLoaderFrameText'
import { DonationWidgetProgressBarText, donationWidgetProgressBarTextName } from './text/DonationWidgetProgressBarText'
import {
	DonationWidgetWishFullFilledAmount,
	donationWidgetWishFullFilledAmountName,
	DonationWidgetWishFullFilledKidName,
	donationWidgetWishFullFilledKidNameName,
	DonationWidgetWishFullFilledWishNumber,
	donationWidgetWishFullFilledWishNumberName,
} from './text/DonationWidgetWishFullFilled'
import {
	DonationWidgetMiddleTextStatic,
	donationWidgetMiddleTextStaticName,
	DonationWidgetPostfixTextStatic,
	donationWidgetPostfixTextStaticName,
	DonationWidgetPrefixTextStatic,
	donationWidgetPrefixTextStaticName,
} from './text/DonationWidgetWishFullFilledStatic'
import { DonationWidgetWishHeading, donationWidgetWishHeadingName } from './text/DonationWidgetWishHeading'
import {
	DonationWidgetWishLastDonation,
	donationWidgetWishLastDonationName,
} from './text/DonationWidgetWishLastDonation'
import {
	DonationWidgetWishLastDonationStatic,
	donationWidgetWishLastDonationStaticName,
} from './text/DonationWidgetWishLastDonationStatic'
import { DonationWidgetWishSubHeading, donationWidgetWishSubHeadingName } from './text/DonationWidgetWishSubHeading'
import { donationWidgetWishTopDonationName, DonationWidgetWishTopDonation } from './text/DonationWidgetWishTopDonation'
import {
	DonationWidgetWishTopDonationStatic,
	donationWidgetWishTopDonationStaticName,
} from './text/DonationWidgetWishTopDonationStatic'

const infoBoxHeightHeadingOffset = 95
const infoBoxHeightContentOffset = 112.5

const infoBoxTopDonationWidthOffset = 585
const infoBoxLastDonationWidthOffset = 395

/**
 * Container for visual DonationWidget
 */
export const donationWidgetContainerName = 'donationWidgetContainer'
export class DonationWidgetContainer extends Phaser.GameObjects.Container {
	private currentWishId?: number
	private donationWidgetState: DonationWidgetState
	private textLoaderTime: Phaser.Time.TimerEvent | null = null
	private textLoaderCounter = 0

	constructor(
		scene: Phaser.Scene,
		state: DonationWidgetState,
		socket: Socket<SocketEventsMap>,
		options: ContainerOptions | undefined
	) {
		super(scene, options?.x, options?.y, options?.children)
		this.name = donationWidgetContainerName
		this.donationWidgetState = state
		this.currentWishId = state.wish?.info?.id
		this.setSize(590, 190)
		this.setScale(state.scale)
		this.setIsVisible(state.isVisible)
		this.setPosition(1920 / 2, 500)
		this.setInteractive({ cursor: 'pointer' })
		this.on('dragend', () => {
			socket.emit(DONATION_WIDGET_UPDATE, {
				position: {
					x: this.x,
					y: this.y,
				},
			})
		})
		scene.events.on(
			'swapCurrentWishText',
			() => {
				this.updateWishContentText()
				this.updateLoadingText()
			},
			this
		)
		scene.events.on(
			'hidingLoadingState',
			() => {
				if (this.textLoaderTime) {
					this.textLoaderTime.destroy()
				}
				this.updateLoadingText('')
				this.textLoaderCounter = 0
			},
			this
		)

		this.handleState(state)
		scene.add.existing(this)
	}

	private updateLoadingText(text?: string) {
		const donationWidgetLoaderFrameText = this.getByName(
			donationWidgetLoaderFrameTextName
		) as DonationWidgetLoaderFrameText

		if (text === '') {
			donationWidgetLoaderFrameText.setText(text)
			return
		}

		this.textLoaderTime = this.scene.time.addEvent({
			startAt: 1450,
			delay: 1500,
			callback: () => {
				const text = loadTextItems[this.textLoaderCounter]
				donationWidgetLoaderFrameText.setText(`... ${text} ...`)
				this.textLoaderCounter++
			},
			callbackScope: this,
			loop: true,
		})
	}

	private updateWishContentText() {
		const headingText = this.getByName(donationWidgetWishHeadingName) as DonationWidgetWishHeading
		headingText.setText(this.donationWidgetState.wish?.info?.kid_name ?? 'Placeholder')

		const subHeadingText = this.getByName(donationWidgetWishSubHeadingName) as DonationWidgetWishSubHeading
		subHeadingText.setText(this.donationWidgetState.wish?.info?.wish ?? 'Placeholder')

		const lastDonation = this.getByName(donationWidgetWishLastDonationName) as DonationWidgetWishLastDonation
		lastDonation.setText(
			`${this.donationWidgetState.wish?.info?.recent_donations[0]?.username ?? 'DEIN NAME'} ${
				this.donationWidgetState.wish?.info?.recent_donations[0]?.amount_net ?? '-'
			} €`
		)

		const topDonation = this.getByName(donationWidgetWishTopDonationName) as DonationWidgetWishTopDonation
		topDonation.setText(
			`${this.donationWidgetState.wish?.info?.top_donors[0]?.username ?? 'DEIN NAME'} ${
				this.donationWidgetState.wish?.info?.top_donors[0]?.amount_net ?? '-' // is net amount (until change)
			} €`
		)

		const progressBar = this.getByName(donationWidgetProgressBarName) as DonationWidgetProgressBar
		progressBar.updateWidth(this.donationWidgetState.wish?.info)

		const progressBarText = this.getByName(donationWidgetProgressBarTextName) as DonationWidgetProgressBarText
		const progressBarTextContent = progressBar.calcProgress(this.donationWidgetState.wish?.info)
		progressBarText.setText(
			`${progressBarTextContent.donationSum}€ (${progressBarTextContent.donationPercentageProgress}% von ${progressBarTextContent.donationGoal}€)`
		)
	}

	public handleState(state: DonationWidgetState) {
		this.donationWidgetState = state
		this.setIsVisible(state.isVisible)

		if (this.x !== state.position.x || this.y !== state.position.y) {
			this.x = state.position.x
			this.y = state.position.y
		}

		if (this.scale != state.scale) {
			this.setScale(state.scale)
			this.scaleContainerItems(state)
		}

		const donationWidgetFullFilled = this.getByName(donationWidgetFullFilledName) as DonationWidgetFullFilled
		donationWidgetFullFilled.setX(-this.displayWidth / 2)
		donationWidgetFullFilled.setY(this.displayHeight)

		// position headingText
		// extract and improve
		const headingText = this.getByName(donationWidgetWishHeadingName) as DonationWidgetWishHeading

		// yeah this needs some improvements
		if (headingText.text === 'Placeholder') {
			this.updateWishContentText()
		}

		headingText.setX(this.displayWidth - 315 * this.scale)
		headingText.setY(15 * this.scale)

		// positionnal text
		// extract and improve
		const subHeadingText = this.getByName(donationWidgetWishSubHeadingName) as DonationWidgetWishSubHeading
		subHeadingText.setX(this.displayWidth - 315 * this.scale)
		subHeadingText.setY(45 * this.scale)

		// LastDonation InfoBox
		const lastDonationStatic = this.getByName(
			donationWidgetWishLastDonationStaticName
		) as DonationWidgetWishLastDonationStatic
		lastDonationStatic.setX(this.displayWidth - infoBoxLastDonationWidthOffset * this.scale)
		lastDonationStatic.setY(infoBoxHeightHeadingOffset * this.scale)

		const lastDonation = this.getByName(donationWidgetWishLastDonationName) as DonationWidgetWishLastDonation
		lastDonation.setX(this.displayWidth - infoBoxLastDonationWidthOffset * this.scale)
		lastDonation.setY(infoBoxHeightContentOffset * this.scale)

		// TopDonation InfoBox
		const topDonationStatic = this.getByName(
			donationWidgetWishTopDonationStaticName
		) as DonationWidgetWishTopDonationStatic
		topDonationStatic.setX(this.displayWidth - infoBoxTopDonationWidthOffset * this.scale)
		topDonationStatic.setY(infoBoxHeightHeadingOffset * this.scale)

		const topDonation = this.getByName(donationWidgetWishTopDonationName) as DonationWidgetWishTopDonation
		topDonation.setX(this.displayWidth - infoBoxTopDonationWidthOffset * this.scale)
		topDonation.setY(infoBoxHeightContentOffset * this.scale)

		// ProgressBar
		const progressBarBackground = this.getByName(donationWidgetProgressBarBackgroundName) as DonationWidgetProgressBar
		progressBarBackground.setX(this.displayWidth - 735 * this.scale)
		progressBarBackground.setY(164.5 * this.scale)

		const progressBar = this.getByName(donationWidgetProgressBarName) as DonationWidgetProgressBar
		progressBar.setX(this.displayWidth - 735 * this.scale)
		progressBar.setY(164.5 * this.scale)

		const progressBarText = this.getByName(donationWidgetProgressBarTextName) as DonationWidgetProgressBarText
		progressBarText.setX(this.displayWidth - 315 * this.scale)
		progressBarText.setY(164.5 * this.scale)

		// fillfiledprefixtext
		const donationWidgetPrefixTextStatic = this.getByName(
			donationWidgetPrefixTextStaticName
		) as DonationWidgetPrefixTextStatic
		donationWidgetPrefixTextStatic.setX(-this.displayWidth / 2 + 20 * this.scale)
		donationWidgetPrefixTextStatic.setY(this.displayHeight + 24 * this.scale)

		// fillfiledmiddletext
		const donationWidgetMiddleTextStatic = this.getByName(
			donationWidgetMiddleTextStaticName
		) as DonationWidgetMiddleTextStatic
		donationWidgetMiddleTextStatic.setX(-this.displayWidth / 2 + 110 * this.scale)
		donationWidgetMiddleTextStatic.setY(this.displayHeight + 24 * this.scale)

		// fillfiledpostfixetext
		const donationWidgetPostfixTextStatic = this.getByName(
			donationWidgetPostfixTextStaticName
		) as DonationWidgetPostfixTextStatic
		donationWidgetPostfixTextStatic.setX(-this.displayWidth / 2 + 215 * this.scale)
		donationWidgetPostfixTextStatic.setY(this.displayHeight + 24 * this.scale)

		// kidnamed fullfiled
		const donationWidgetWishFullFilledKidName = this.getByName(
			donationWidgetWishFullFilledKidNameName
		) as DonationWidgetWishFullFilledKidName
		donationWidgetWishFullFilledKidName.setX(-this.displayWidth / 2 + 350 * this.scale)
		donationWidgetWishFullFilledKidName.setY(this.displayHeight + 24 * this.scale)

		// wish number
		const donationWidgetWishFullFilledWishNumber = this.getByName(
			donationWidgetWishFullFilledWishNumberName
		) as DonationWidgetWishFullFilledWishNumber
		donationWidgetWishFullFilledWishNumber.setX(-this.displayWidth / 2 + 93 * this.scale)
		donationWidgetWishFullFilledWishNumber.setY(this.displayHeight + 24 * this.scale)

		// wish amount
		const donationWidgetWishFullFilledAmount = this.getByName(
			donationWidgetWishFullFilledAmountName
		) as DonationWidgetWishFullFilledAmount
		donationWidgetWishFullFilledAmount.setX(this.displayWidth - 368 * this.scale)
		donationWidgetWishFullFilledAmount.setY(this.displayHeight + 25 * this.scale)

		// loader text
		const donationWidgetLoaderFrameText = this.getByName(
			donationWidgetLoaderFrameTextName
		) as DonationWidgetLoaderFrameText
		donationWidgetLoaderFrameText.setX(this.displayWidth - 485 * this.scale)
		donationWidgetLoaderFrameText.setY(this.displayHeight - 45 * this.scale)

		const donationWidgetLoaderFrame = this.getByName(donationWidgetLoaderFrameName) as DonationWidgetLoaderFrame
		donationWidgetLoaderFrame.setX(this.displayWidth / 2 + 1 * this.scale)
		donationWidgetLoaderFrame.setY(1 * this.scale)

		if (this.currentWishId !== state.wish?.info?.id) {
			donationWidgetLoaderFrame.showLoadingState()
		}
		this.currentWishId = state.wish?.info?.id
	}

	public handleMawJsonStateUpdate = (mawJsonInfo: MakeAWishInfoJsonDTO, streamer: string) => {
		const rootWishes = mawJsonInfo.wishes
		const streamerRootWishes = []

		for (const key of Object.keys(rootWishes)) {
			const rootWish = rootWishes[key]
			// eslint-disable-next-line no-prototype-builtins
			if (rootWish.streamers.hasOwnProperty(streamer)) {
				streamerRootWishes.push(rootWishes[key])
			}
		}

		const donationWidgetFullFilled = this.getByName(donationWidgetFullFilledName) as DonationWidgetFullFilled

		if (donationWidgetFullFilled) {
			donationWidgetFullFilled.setFullFilledWishes(streamerRootWishes)
			donationWidgetFullFilled.setFullFilledWishContent()
		}
	}

	private scaleContainerItems = (state: DonationWidgetState) => {
		const containerItems = this.getAll() as GameObjects.Sprite[]
		containerItems.map((items) => items.setScale(state.scale))
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
