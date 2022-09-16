import { DonationWidgetState, MakeAWishRootLevelWishDTO } from '@cp/common'
import { GameObjects } from 'phaser'
import {
	DonationWidgetWishFullFilledAmount,
	donationWidgetWishFullFilledAmountName,
	DonationWidgetWishFullFilledKidName,
	donationWidgetWishFullFilledKidNameName,
	DonationWidgetWishFullFilledWishNumber,
	donationWidgetWishFullFilledWishNumberName,
} from './text/DonationWidgetWishFullFilled'
import {
	donationWidgetMiddleTextStaticName,
	donationWidgetPostfixTextStaticName,
	donationWidgetPrefixTextStaticName,
} from './text/DonationWidgetWishFullFilledStatic'

export const donationWidgetFullFilledName = 'donationWidgetFullFilled'
export class DonationWidgetFullFilled extends Phaser.GameObjects.Sprite {
	private currentFullFilledWishIndex = 0
	private intervalId: undefined | ReturnType<typeof window.setInterval>
	private readonly pollIntervalInSeconds = 5

	private fullfilledWishes: MakeAWishRootLevelWishDTO[] = []

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		state: DonationWidgetState,
		texture: string,
		fullfilledWishes: MakeAWishRootLevelWishDTO[]
	) {
		super(scene, x, y, texture)
		this.name = donationWidgetFullFilledName
		this.setOrigin(0, 0)
		this.setScale(state.scale)
		this.scene.add.existing(this)
		this.setFullFilledWishes(fullfilledWishes)
		this.visible = false
		this.startRotate()
	}

	public getFullFilledWishes() {
		return this.fullfilledWishes
	}

	public setFullFilledWishes = (wishes: MakeAWishRootLevelWishDTO[]) => {
		if (!wishes || wishes.length <= 0) return []
		const fullfilledWishes = []

		for (const wish of wishes) {
			if (Number(wish.current_donation_sum) >= Number(wish.donation_goal)) {
				fullfilledWishes.push(wish)
			}
		}

		this.fullfilledWishes = fullfilledWishes
	}

	public setFullFilledWishContent() {
		if (this.getFullFilledWishes().length <= 0) return
		this.setVisibleStaticContent()
		this.visible = true

		const kidNameContainer = this.parentContainer.getByName(
			donationWidgetWishFullFilledKidNameName
		) as DonationWidgetWishFullFilledKidName
		kidNameContainer.visible = true
		kidNameContainer.setText(this.getFullFilledWishes()[this.currentFullFilledWishIndex].kid_name)

		const wishNumber = this.parentContainer.getByName(
			donationWidgetWishFullFilledWishNumberName
		) as DonationWidgetWishFullFilledWishNumber
		wishNumber.visible = true
		wishNumber.setText(this.getFullFilledWishes()[this.currentFullFilledWishIndex].id.toString())

		const wishAmount = this.parentContainer.getByName(
			donationWidgetWishFullFilledAmountName
		) as DonationWidgetWishFullFilledAmount
		wishAmount.visible = true
		wishAmount.setText(
			this.getFullFilledWishes()[this.currentFullFilledWishIndex].current_donation_sum.toString() + '€'
		)
	}
	private setVisibleStaticContent() {
		const static0 = this.parentContainer.getByName(donationWidgetPrefixTextStaticName) as GameObjects.Text
		const static2 = this.parentContainer.getByName(donationWidgetMiddleTextStaticName) as GameObjects.Text
		const static3 = this.parentContainer.getByName(donationWidgetPostfixTextStaticName) as GameObjects.Text
		static0.visible = true
		static2.visible = true
		static3.visible = true
	}

	private increaseCurrentWishIndex() {
		if (this.currentFullFilledWishIndex + 1 >= this.getFullFilledWishes().length) {
			this.currentFullFilledWishIndex = 0
		} else {
			this.currentFullFilledWishIndex = this.currentFullFilledWishIndex + 1
		}
	}

	public startRotate() {
		this.intervalId = setInterval(() => {
			if (this.getFullFilledWishes().length > 0) {
				this.setFullFilledWishContent()
				this.increaseCurrentWishIndex()
			}
		}, this.pollIntervalInSeconds * 1000)
	}

	public stopPoll() {
		if (typeof this.intervalId !== 'undefined') {
			clearInterval(this.intervalId)
		}
	}
}
