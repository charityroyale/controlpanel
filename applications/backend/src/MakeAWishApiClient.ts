import { MakeAWishInfoJsonDTO } from '@cp/common'
import { logger } from './logger'
import { CmsUpcomingStreamer } from './types/cms'

class MakeAWishApiClient {
	public static readonly mawApiUrl = 'https://streamer.make-a-wish.at/charityroyale2024/info.json'
	public mawInfoJsonData: null | MakeAWishInfoJsonDTO = null
	public cmsMawWishes: null | CmsUpcomingStreamer[] = null

	private intervalId: undefined | ReturnType<typeof setInterval>
	private readonly pollIntervalInSeconds = 10

	public poll() {
		this.intervalId = setInterval(() => {
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
			const response = await fetch(MakeAWishApiClient.mawApiUrl)
			if (response.ok || response.status === 304) {
				logger.info('Success fetch MAW data')
				const data = (await response.json()) as MakeAWishInfoJsonDTO
				this.mawInfoJsonData = data
				return data
			}
			const body = await response.text()
			logger.warn(`Issue fetching maw data ${response.status} ${body} via "${MakeAWishApiClient.mawApiUrl}".`)
			return null
		} catch (e) {
			if (e instanceof TypeError) {
				logger.error(`Network error issue while fetching maw data: ${e.message}`)
				logger.error(`Stack trace: ${e.stack}`)
				logger.debug(`URL: ${MakeAWishApiClient.mawApiUrl}`)
			} else if (e instanceof Error) {
				logger.error(`Unexpected error while fetching maw data: ${e.message}`)
				logger.error(`Stack trace: ${e.stack}`)
				logger.debug(`URL: ${MakeAWishApiClient.mawApiUrl}`)
			} else {
				logger.error(`Unknown error while fetching maw data: ${e}`)
			}
			return null
		}
	}
}

export const mawApiClient = new MakeAWishApiClient()
