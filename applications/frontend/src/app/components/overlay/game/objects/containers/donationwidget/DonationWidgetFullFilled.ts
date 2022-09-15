import { DonationWidgetState, MakeAWishRootLevelWishDTO } from '@cp/common'
import {
	DonationWidgetWishFullFilledAmount,
	donationWidgetWishFullFilledAmountName,
	DonationWidgetWishFullFilledKidName,
	donationWidgetWishFullFilledKidNameName,
	DonationWidgetWishFullFilledWishNumber,
	donationWidgetWishFullFilledWishNumberName,
} from './text/DonationWidgetWishFullFilled'

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

		const kidNameContainer = this.parentContainer.getByName(
			donationWidgetWishFullFilledKidNameName
		) as DonationWidgetWishFullFilledKidName
		kidNameContainer.setText(this.getFullFilledWishes()[this.currentFullFilledWishIndex].kid_name)

		const wishNumber = this.parentContainer.getByName(
			donationWidgetWishFullFilledWishNumberName
		) as DonationWidgetWishFullFilledWishNumber
		wishNumber.setText(this.getFullFilledWishes()[this.currentFullFilledWishIndex].id.toString())

		const wishAmount = this.parentContainer.getByName(
			donationWidgetWishFullFilledAmountName
		) as DonationWidgetWishFullFilledAmount
		wishAmount.setText(
			this.getFullFilledWishes()[this.currentFullFilledWishIndex].current_donation_sum.toString() + '€'
		)
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
