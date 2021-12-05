import './env'
import { logger } from './logger'
import { createServer } from 'http'
import { Server } from 'socket.io'
import express, { NextFunction, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import SessionManager from './SessionManager'
import { PFTPSocketEventsMap, Donation, UserEntry } from '@pftp/common'
import SimpleUserDbService from './SimpleUserDbService'
import path from 'path'
import cors from 'cors'
import fs from 'fs'
import ymlJs from 'js-yaml'

const whiteListedCommunicationOrigins = [
	'http://localhost:4200',
	'https://pftp.redcouch.at',
	'https://streamer.make-a-wish.at',
]

const port = process.env.PORT_BACKEND ?? 5200
const simpleUserDbService = new SimpleUserDbService(process.env.USER_DB ?? `http://localhost:${port}/userdb.yml`)

const app = express()
const httpServer = createServer(app)
const io = new Server<PFTPSocketEventsMap>(httpServer, {
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
		origin: ['http://localhost:4200', 'https://redcouch.at'],
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

app.get('/userdb.yml', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/userdb.yml'))
})

app.get('/streamers', (req, res) => {
	try {
		const file = fs.readFileSync(path.join(__dirname, '../public/userdb.yml'), 'utf8')
		const doc = ymlJs.load(file) as UserEntry[]
		res.send(doc)
	} catch (e) {
		console.log(e)
	}
})

if (typeof process.env.SOCKETIO_AUTH_SECRET !== 'string') {
	logger.warn('No secret for socket-io auth set. Please set the env variable SOCKETIO_AUTH_SECRET')
}
const jwtSecret = process.env.SOCKETIO_AUTH_SECRET ?? 'secret'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sessionManager = new SessionManager(io, jwtSecret)

httpServer.listen(port)
logger.info(`Backend ready on port ${port}`)
