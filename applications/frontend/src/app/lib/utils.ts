export const formatTimeStamp = (timestamp: number) => {
	return new Intl.DateTimeFormat('de-AT', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(timestamp * 1000))
}

export const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' }).format(amount)
}
