import { Speaker } from '@cp/common'
import tts from '@google-cloud/text-to-speech'
import fs from 'fs'
import util from 'util'
import { logger } from './logger'

const client = new tts.TextToSpeechClient()

export async function createTextToSpeechFile(text: string, speaker: Speaker, id: number) {
	const request = {
		input: { text },
		voice: { ...speaker },
		audioConfig: { audioEncoding: 'MP3' },
	} as never // google.cloud.texttospeech.v1.ISynthesizeSpeechRequest

	try {
		const [response] = await client.synthesizeSpeech(request)
		if (response.audioContent) {
			const writeFile = util.promisify(fs.writeFile)
			await writeFile(`./public/${id}.mp3`, response.audioContent, 'binary')

			logger.info(`Audio content written to file: ${id}.mp3`)
		} else {
			logger.info(`Audio content is empty for file with id ${id}`)
		}
	} catch (e) {
		logger.info(`Audio content couldn't be retrieved and saved to file with id ${id}`)
		logger.error(e)
	}
}
