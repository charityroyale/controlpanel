import { Donation } from '@cp/common'

export const formatTimeStamp = (timestamp: number) => {
	return new Intl.DateTimeFormat('de-AT', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(timestamp * 1000))
}

export function formatMoney(amount: string | number | undefined, ignoreCents: boolean = false) {
	const parsed = parseFloat(`${amount}`)
	if (isNaN(parsed)) {
		return '0,00'
	}
	return (ignoreCents ? parsed : parsed / 100).toLocaleString('de-DE', { minimumFractionDigits: 2 })
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

export const formatWishSlugStats = (slug: string) => {
	const wishLabel = slug
		.split('-')
		.map((word) => {
			return word.charAt(0).toUpperCase() + word.slice(1)
		})
		.join(' ')
	return `${wishLabel}`
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

	const testMessages = ['I love <4?', 'I love <5?', 'I love you <3!']
	const message = testMessages[Math.floor(Math.random() * testMessages.length)]

	const donation: Donation = {
		id: getRandomId(),
		user: name,
		amount: randomnum * 100,
		amount_net: randomnum * 100,
		timestamp: new Date().getTime() / 1000,
		streamer,
		message,
		fullFilledWish: false,
	}
	return donation
}

export const getRandomId = () => {
	return Math.floor(Math.random() * 10000)
}
