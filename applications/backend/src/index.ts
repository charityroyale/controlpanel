import { configureStore } from '@reduxjs/toolkit'
import { logger } from './logger'
import {
	CHARACTER_UPDATE,
	Donation,
	DONATION_TRIGGER,
	getBehaviourFromDonation,
	GlobalState,
	PFTPSocketEventsMap,
	PigStateType,
	REQUEST_STATE,
	SETTINGS_UPDATE,
	STATE_UPDATE,
} from '@pftp/common'
import { characterReducer, settingsReducer, updateCharacter, updateSettings } from './State'
import { createServer } from 'http'
import { Server } from 'socket.io'
import express, { NextFunction, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({
	path: path.resolve(__dirname, '../.env'),
})

const whiteListedCommunicationOrigins = [
	'http://localhost:4200',
	'https://pftp.redcouch.at',
	'https://streamer.make-a-wish.at',
]
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

const store = configureStore<GlobalState>({
	reducer: {
		character: characterReducer,
		settings: settingsReducer,
	},
})

app.post('/token', body('client_id').isString(), (request, response) => {
	const errors = validationResult(request)
	if (!errors.isEmpty() && request.body.client_id === process.env.CLIENT_ID_SECRET) {
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
		const { clientId } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as any
		logger.info(`ClientId gained access ${clientId}`)
		next()
	} catch (error) {
		logger.info(`Denied access for ${req.ip}`)
		res.sendStatus(403)
	}
}

app.post(
	'/donation',
	body('user').isString(),
	body('amount').isInt(),
	body('timestamp').isInt(),
	authenticateJWT,
	(request, response) => {
		const errors = validationResult(request)
		if (!errors.isEmpty()) {
			return response.status(400).json({ errors: errors.array() })
		}
		const donation = request.body as Donation
		const behaviour = getBehaviourFromDonation(donation)
		io.emit(DONATION_TRIGGER, donation, behaviour)
		response.send(request.body)
	}
)

io.on('connection', (socket) => {
	logger.info(`new connection from ${socket.id}!`)

	socket.on(CHARACTER_UPDATE, (characterUpdate) => store.dispatch(updateCharacter(characterUpdate)))
	socket.on(SETTINGS_UPDATE, (settingsUpdate) => store.dispatch(updateSettings(settingsUpdate)))

	socket.on('disconnect', (reason) => {
		logger.info(`socket ${socket.id} disconnected with reason: ${reason}`)
	})

	socket.on(DONATION_TRIGGER, (donation: Donation, behaviour: PigStateType) => {
		io.emit(DONATION_TRIGGER, donation, behaviour)
	})
	socket.emit(STATE_UPDATE, store.getState())
	socket.on(REQUEST_STATE, () => socket.emit(STATE_UPDATE, store.getState()))
})

store.subscribe(() => {
	io.emit(STATE_UPDATE, store.getState())
	console.log(store.getState())
})

const port = process.env.PORT_BACKEND ?? 5200
httpServer.listen(port)
logger.info(`Backend ready on port ${port}`)
