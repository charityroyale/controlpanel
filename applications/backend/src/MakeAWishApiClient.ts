import { MakeAWishInfoJsonDTO } from '@pftp/common'
import fetch from 'node-fetch'
import { logger } from './logger'

export const fetchMawData = async (): Promise<MakeAWishInfoJsonDTO | null> => {
	try {
		const response = await fetch('https://streamer.make-a-wish.at/charityroyale2021/info.json')
		if (response.ok) {
			const data = (await response.json()) as MakeAWishInfoJsonDTO
			return data
		}
		return null
	} catch (e) {
		logger.error(`Error fetching maw data: ${e}`)
		return null
	}
}

let intervalId: undefined | ReturnType<typeof setInterval>
export let mawInfoJsonData: null | MakeAWishInfoJsonDTO = null
export const pollMawInfoJsonData = () => {
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	intervalId = setInterval(async () => {
		mawInfoJsonData = await fetchMawData()
	}, 5000)

	console.log(`Created new MAW-Data polling interval.`)
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
;(async () => {
	mawInfoJsonData = await fetchMawData()
})()
