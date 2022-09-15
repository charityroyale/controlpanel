import YAML from 'yaml'
import fetch from 'node-fetch'
import { databaseServiceLogger as logger } from './logger'
import { UserEntry } from '@cp/common'

export default class SimpleUserDbService {
	private userDatabase: UserEntry[] = []

	constructor(private readonly databaseLocation: string) {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		this.loadDatabase()
	}

	private async loadDatabase() {
		try {
			const fetchedDatabase = await this.fetchDatabase()
			if (!this.checkDatabase(fetchedDatabase)) {
				throw new Error('Wrong database format')
			}
			this.userDatabase = fetchedDatabase

			logger.info(`Database loaded with ${this.userDatabase.length} entries`)
		} catch (e) {
			logger.warn(`Failed to load database from ${this.databaseLocation}`)
			logger.debug(e)
		}
	}

	private async fetchDatabase() {
		const response = await fetch(this.databaseLocation)
		const responseText = await response.text()
		const config = YAML.parse(responseText)
		return config
	}

	private checkDatabase(database: any): database is UserEntry[] {
		if (database[0] === undefined || database[0].streamer === undefined || database[0].channel === undefined) {
			return false
		}
		return true
	}

	public findChannelByStreamer(streamer: string) {
		return this.userDatabase.find((entry) => entry.streamer === streamer)?.channel
	}

	public getAllStreamers() {
		return this.userDatabase
	}
}
