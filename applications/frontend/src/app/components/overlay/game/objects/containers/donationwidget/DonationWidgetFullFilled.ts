import { DonationWidgetState, MakeAWishRootLevelWishDTO } from '@pftp/common'
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
		kidNameContainer.setText(this.getFullFilledWishes()[0].kid_name)

		const wishNumber = this.parentContainer.getByName(
			donationWidgetWishFullFilledWishNumberName
		) as DonationWidgetWishFullFilledWishNumber
		wishNumber.setText(this.getFullFilledWishes()[0].id.toString())

		const wishAmount = this.parentContainer.getByName(
			donationWidgetWishFullFilledAmountName
		) as DonationWidgetWishFullFilledAmount
		wishAmount.setText(this.getFullFilledWishes()[0].current_donation_sum.toString() + '€')
	}
}
