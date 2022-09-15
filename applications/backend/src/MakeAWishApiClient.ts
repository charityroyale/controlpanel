import { MakeAWishInfoJsonDTO } from '@cp/common'
import fetch from 'node-fetch'
import { logger } from './logger'

class MakeAWishApiClient {
	public static readonly mawUri2021 = 'https://streamer.make-a-wish.at/charityroyale2021/info.json'
	public static readonly mawUri2022 = 'https://streamer.make-a-wish.at/charityroyale2022/info.json'
	public mawInfoJsonData: null | MakeAWishInfoJsonDTO = null

	private intervalId: undefined | ReturnType<typeof setInterval>
	private readonly pollIntervalInSeconds = 15

	public poll() {
		this.intervalId = setInterval(() => {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			this.fetchMawData()
				.then((data) => {
					this.mawInfoJsonData = data
				})
				.catch((_e) => {
					// fail silently
				})
		}, this.pollIntervalInSeconds * 1000)
	}

	public stopPoll() {
		if (typeof this.intervalId !== 'undefined') {
			clearInterval(this.intervalId)
		}
	}

	public fetchMawData = async (): Promise<MakeAWishInfoJsonDTO | null> => {
		try {
			const response = await fetch(MakeAWishApiClient.mawUri2021)
			if (response.ok) {
				const data = (await response.json()) as MakeAWishInfoJsonDTO
				this.mawInfoJsonData = data
				logger.info(`Success fetching maw data`)
				return data
			}
			logger.warn(`Issue fetching maw data`)
			return null
		} catch (e) {
			logger.error(`Error fetching maw data: ${e}`)
			return null
		}
	}
}

export const mawApiClient = new MakeAWishApiClient()
