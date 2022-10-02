import fs from 'fs'
import path from 'path'
import { logger } from './logger'

const cleanUpIntervalInSeconds = 10
const directory = path.join(__dirname, '../public')
const cleanUpJobInMinutes = 20

export const startCleanUpMp3FilesInterval = () => {
	setInterval(() => {
		const dateThresholdToDelete = Date.now() - 1000 * 60 * cleanUpJobInMinutes

		fs.readdir(directory, (err, files) => {
			if (err) {
				logger.error(`Couldn't read files from directory: ${directory}`)
			}

			for (const file of files) {
				const filePath = path.join(directory, file)

				fs.stat(filePath, (err, stats) => {
					if (err) {
						throw err
					}

					if (stats.ctimeMs <= dateThresholdToDelete && filePath.includes('.mp3')) {
						fs.unlink(filePath, (err) => {
							if (err) {
								logger.error(`Couldn't unlink file from directory: ${file}`)
							}
						})
					}
				})
			}
		})
	}, cleanUpIntervalInSeconds * 1000)
}
