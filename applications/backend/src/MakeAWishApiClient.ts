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
