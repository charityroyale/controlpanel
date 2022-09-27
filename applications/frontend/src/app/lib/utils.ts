import { Donation } from '@cp/common'

export const formatTimeStamp = (timestamp: number) => {
	return new Intl.DateTimeFormat('de-AT', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(timestamp * 1000))
}

export const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' }).format(amount)
}

export const formatDonationAlertCurrenty = (amount: number) => {
	return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount)
}

export const getPercentage = (value: number, total: number) => {
	return (100 * value) / total
}

export const formatWishSlug = (slug: string) => {
	const wishLabel = slug
		.split('-')
		.map((word) => {
			return word.toUpperCase()
		})
		.join(' ')
	return `Wish: ${wishLabel}`
}

export const generateRandomDonation = (streamer: string, donationAmount?: number) => {
	const precision = 2
	const maxAmount = 1250
	const randomnum = donationAmount
		? donationAmount
		: Math.floor(Math.random() * (maxAmount * precision - 1 * precision) + 1 * precision) / (1 * precision)

	const a = ['TestUserA_', 'TestUserB_', 'TestUserC_']
	const b = ['Lasagne', 'StrawBerry', 'Spaghetti']

	const rA = Math.floor(Math.random() * a.length)
	const rB = Math.floor(Math.random() * b.length)
	const name = a[rA] + b[rB]

	const testMessages = [
		'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
		'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy ei',
		'I love you <3!',
		'Lorem ipsum dolor sit amet, consetetur sadipscingddd elitr, sed diam nonumy ei Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy ei',
	]
	const message = testMessages[Math.floor(Math.random() * testMessages.length)]

	const donation: Donation = {
		user: name,
		amount: randomnum,
		amount_net: randomnum,
		timestamp: new Date().getTime() / 1000,
		streamer,
		message,
		fullFilledWish: false,
	}
	return donation
}
