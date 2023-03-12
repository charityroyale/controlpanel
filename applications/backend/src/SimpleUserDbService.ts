import { databaseServiceLogger as logger } from './logger'
import { UserEntry } from '@cp/common'
import { mawApiClient } from './MakeAWishApiClient'

export default class SimpleUserDbService {
	private userDatabase: UserEntry[] = []

	constructor() {
		this.updateDataBase()
	}

	public async updateDataBase() {
		try {
			const userEntries = await this.fetchUserEntries()
			this.userDatabase = userEntries

			logger.info(`Database loaded with ${this.userDatabase.length} entries`)
		} catch (e) {
			logger.warn(`Failed to load database`)
			logger.debug(e)
		}
	}

	private async fetchUserEntries() {
		const response = await mawApiClient.fetchMawData()
		if (response !== null) {
			const streamer = Object.keys(response.streamers).map((streamerKey) => {
				return {
					channel: streamerKey,
					streamer: streamerKey,
					type: response.streamers[streamerKey].type,
				}
			})
			return streamer
		}
		return []
	}

	public findChannelByStreamer(streamer: string) {
		return this.userDatabase.find((entry) => entry.streamer === streamer)?.channel
	}

	public getAllStreamers() {
		return this.userDatabase
	}
}
