import YAML from 'yaml'
import fetch from 'node-fetch'
import { databaseServiceLogger as logger } from './logger'

interface UserEntry {
	userName: string
	channelId: string
	channelName: string
}

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
		if (database[0] === undefined || database[0].userName === undefined) {
			return false
		}
		return true
	}

	public channelNameFromId(channelId: string) {
		return this.userDatabase.find((entry) => entry.channelId === channelId)?.channelName
	}

	public userNameFromId(channelId: string) {
		return this.userDatabase.find((entry) => entry.channelId === channelId)?.userName
	}

	public channelNameFromUsername(userName: string) {
		return this.userDatabase.find((entry) => entry.userName === userName)?.channelName
	}
}
