import { Speaker } from '@cp/common'
import textToSpeech from '@google-cloud/text-to-speech'
import fs from 'fs'
import util from 'util'

const client = new textToSpeech.TextToSpeechClient()

export async function updateTts(text: string, speaker: Speaker) {
	const request = {
		input: { text },
		voice: { ...speaker },
		audioConfig: { audioEncoding: 'MP3' },
	}

	// Performs the text-to-speech request
	const [response] = await client.synthesizeSpeech(request)

	const writeFile = util.promisify(fs.writeFile)
	await writeFile('./public/tts.mp3', response.audioContent, 'binary')
	console.log('Audio content written to file: tts.mp3')
}
