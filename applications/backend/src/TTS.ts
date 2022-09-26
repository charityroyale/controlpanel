import { Speaker } from '@cp/common'
import textToSpeech from '@google-cloud/text-to-speech'
import fs from 'fs'
import util from 'util'
import { logger } from './logger'

const client = new textToSpeech.TextToSpeechClient()

export async function updateTts(text: string, speaker: Speaker, streamer: string) {
	const request = {
		input: { text },
		voice: { ...speaker },
		audioConfig: { audioEncoding: 'MP3' },
	}
	try {
		const [response] = await client.synthesizeSpeech(request)
		const writeFile = util.promisify(fs.writeFile)
		await writeFile(`./public/${streamer}.mp3`, response.audioContent, 'binary')

		logger.info(`Audio content written to file: ${streamer}.mp3`)
	} catch (e) {
		logger.error(e)
	}
}
