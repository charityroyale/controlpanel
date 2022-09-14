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
	const splitByDashSlug = slug.split("-");
	const wishLabel = splitByDashSlug.join(" ");
	return `Kid: ${wishLabel}`
}