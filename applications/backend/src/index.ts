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
import path from 'path'
import fetch from 'node-fetch'
import { CmsContent } from './types/cms'
import yaml from 'js-yaml'
import bodyParser from 'body-parser'

const whiteListedCommunicationOrigins = [
	'http://localhost:4200',
	'https://charityroyale.redcouch.at',
	'https://streamer.make-a-wish.at',
]

const cmsDataUrl = 'https://raw.githubusercontent.com/charityroyale/webapplication/release/_cms/charity-royale.md'

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

	if (token == null) {
		logger.info(`Empty token for for ${req.ip}`)
		return res.sendStatus(401)
	}
	try {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { clientId } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as any
		next()
	} catch (error) {
		logger.info(`Denied access for ${req.ip}`)
		res.sendStatus(403)
	}
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.post('/sync/cms', bodyParser.raw(), authenticateJWT, (request, response) => {
	try {
		const bodyContent = request.body
		console.log('withbodyparser')
		console.log(bodyContent)
		yaml.loadAll(bodyContent, function (doc) {
			if (doc !== null) {
				console.log(doc)
				const cmsData = doc as CmsContent
				mawApiClient.cmsMawWishes = cmsData.upcoming
				logger.info('CMS data synced')
			}
		})
		response.sendStatus(200)
	} catch (e) {
		logger.error(e)
		response.sendStatus(500)
	}
})

app.post(
	'/donation',
	body('user').isString(),
	body('amount').isFloat(),
	body('net_amount').isFloat(),
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
			 * Includes whitelist for streamers 'krokoboss' and 'shredmir', 'ichbinzarbex' and 'filow'
			 * which get mapped to channel: 'krokoboss-shredmir', 'ichbinzarbex-filow'
			 */

			if (targetChannel === 'krokoboss' || targetChannel === 'shredmir') {
				sessionManager.getOrCreateSession('krokoboss').sendDonationPreprocessing(donation)
				sessionManager.getOrCreateSession('shredmir').sendDonationPreprocessing(donation)
			} else if (targetChannel === 'ichbinzarbex' || targetChannel === 'filow') {
				sessionManager.getOrCreateSession('ichbinzarbex').sendDonationPreprocessing(donation)
				sessionManager.getOrCreateSession('filow').sendDonationPreprocessing(donation)
			} else {
				sessionManager.getOrCreateSession(targetChannel).sendDonationPreprocessing(donation)
			}
		}

		response.send(request.body)
	}
)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get('/streamers', async (req, res) => {
	try {
		await simpleUserDbService.updateDataBase()

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

app.use('/static', express.static(path.join(__dirname, '../public')))

if (typeof process.env.SOCKETIO_AUTH_SECRET !== 'string') {
	logger.warn('No secret for socket-io auth set. Please set the env variable SOCKETIO_AUTH_SECRET')
}
const jwtSecret = process.env.SOCKETIO_AUTH_SECRET ?? 'secret'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sessionManager = new SessionManager(io, jwtSecret)
// eslint-disable-next-line @typescript-eslint/no-floating-promises
mawApiClient.fetchMawData()
mawApiClient.poll()

const initialMawCmsData = async () => {
	const rawResponseData = await fetch(cmsDataUrl)
	const rawData = await rawResponseData.text()

	yaml.loadAll(rawData, function (doc) {
		if (doc !== null) {
			const cmsData = doc as CmsContent
			mawApiClient.cmsMawWishes = cmsData.upcoming
		}
	})
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
initialMawCmsData()

httpServer.listen(port)
logger.info(`Backend ready on port ${port}`)
