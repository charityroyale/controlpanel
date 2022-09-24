import './env'
import { logger } from './logger'
import { createServer } from 'http'
import { Server } from 'socket.io'
import express, { NextFunction, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import SessionManager from './SessionManager'
import { SocketEventsMap, Donation } from '@cp/common'
import SimpleUserDbService from './SimpleUserDbService'
import cors from 'cors'
import { mawApiClient } from './MakeAWishApiClient'

// Imports the Google Cloud client library
import textToSpeech from '@google-cloud/text-to-speech'

// Import other required libraries
import fs from 'fs'
import util from 'util'

const whiteListedCommunicationOrigins = [
	'http://localhost:4200',
	'https://charityroyale.redcouch.at',
	'https://streamer.make-a-wish.at',
]

const port = process.env.PORT_BACKEND ?? 5200
const simpleUserDbService = new SimpleUserDbService()

const app = express()
const httpServer = createServer(app)
const io = new Server<SocketEventsMap>(httpServer, {
	transports: ['websocket', 'polling'],
	allowRequest: (req, callback) => {
		const allowed =
			whiteListedCommunicationOrigins.findIndex((element) => element.includes(req.headers.origin ?? '')) !== -1
		if (!allowed) {
			logger.info(`Denied access from  ${req.headers.origin}`)
		}
		callback(null, allowed)
	},
	cors: {
		origin: whiteListedCommunicationOrigins,
	},
})
app.use(express.json())
app.use(
	cors({
		origin: ['http://localhost:4200', 'https://redcouch.at', 'https://charityroyale.redcouch.at'],
	})
)

app.post('/token', body('client_id').isString(), (request, response) => {
	const errors = validationResult(request)
	if (!errors.isEmpty() || request.body.client_id !== process.env.CLIENT_ID_SECRET) {
		return response.status(400).json({ errors: errors.array() })
	}

	const clientId = request.body.client_id
	const client = { clientId }
	const accessToken = generateAccessToken(client)

	logger.info(`Generated new AccessToken for client ${clientId}`)

	response.json({ accessToken })
})

const generateAccessToken = (client: {}) => {
	return jwt.sign(client, process.env.ACCESS_TOKEN_SECRET as string)
}

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization
	const token = authHeader?.split(' ')[1]

	if (token == null) return res.sendStatus(401)

	try {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { clientId } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as any
		next()
	} catch (error) {
		logger.info(`Denied access for ${req.ip}`)
		res.sendStatus(403)
	}
}

app.post(
	'/donation',
	body('user').isString(),
	body('amount').isFloat(),
	body('timestamp').isInt(),
	body('message').isString(),
	body('streamer').isString(),
	body('fullFilledWish').isBoolean(),
	authenticateJWT,
	(request, response) => {
		const errors = validationResult(request)
		if (!errors.isEmpty()) {
			return response.status(400).json({ errors: errors.array() })
		}
		const donation = request.body as Donation

		const targetChannel = simpleUserDbService.findChannelByStreamer(request.body.streamer)
		if (targetChannel !== undefined) {
			/**
			 * Includes whitelist for streamers 'krokoboss' and 'shredmir'
			 * which get mapped to channel: 'krokoboss-shredmir'
			 */
			if (targetChannel === 'krokoboss' || targetChannel === 'shredmir') {
				sessionManager.getOrCreateSession('krokoboss').sendDonation(donation)
				sessionManager.getOrCreateSession('shredmir').sendDonation(donation)
			} else {
				sessionManager.getOrCreateSession(targetChannel).sendDonation(donation)
			}
		}

		response.send(request.body)
	}
)

app.get('/streamers', (req, res) => {
	try {
		if (simpleUserDbService.getAllStreamers().length <= 0) {
			logger.warn('Streamerdata is empty')
			throw new Error('No streamers found')
		} else {
			res.send(simpleUserDbService.getAllStreamers())
		}
	} catch (e) {
		res.status(500).send(e)
		logger.error(e)
	}
})

app.get('/tts', (req, res) => {
	try {
		return res.download('./output.mp3', (err) => {
			// handle errors
			console.log(err)
		})
	} catch (e) {
		res.status(500).send(e)
		logger.error(e)
	}
})

if (typeof process.env.SOCKETIO_AUTH_SECRET !== 'string') {
	logger.warn('No secret for socket-io auth set. Please set the env variable SOCKETIO_AUTH_SECRET')
}
const jwtSecret = process.env.SOCKETIO_AUTH_SECRET ?? 'secret'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sessionManager = new SessionManager(io, jwtSecret)
// eslint-disable-next-line @typescript-eslint/no-floating-promises
mawApiClient.fetchMawData()
mawApiClient.poll()
httpServer.listen(port)
logger.info(`Backend ready on port ${port}`)

// Creates a client
const client = new textToSpeech.TextToSpeechClient()

async function quickStart() {
	// The text to synthesize
	const text = 'hallo ihr süßen, wie hört sich die stimme an?'

	// Construct the request
	const request = {
		input: { text: text },
		// Select the language and SSML voice gender (optional)
		voice: { languageCode: 'de-DE', voice: 'de-DE-Wavenet-D', ssmlGender: 'MALE' },
		// select the type of audio encoding
		audioConfig: { audioEncoding: 'MP3' },
	}

	// Performs the text-to-speech request
	const [response] = await client.synthesizeSpeech(request)
	// Write the binary audio content to a local file
	const writeFile = util.promisify(fs.writeFile)
	await writeFile('output.mp3', response.audioContent, 'binary')
	console.log('Audio content written to file: output.mp3')
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
quickStart()
