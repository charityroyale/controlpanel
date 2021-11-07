import { logger } from './logger'
import {
	Donation,
	DONATION_TRIGGER,
	getBehaviourFromDonation,
	PFTPSocketEventsMap,
} from '@pftp/common'
import { createServer } from 'http'
import { Server } from 'socket.io'
import express, { NextFunction, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import path from 'path'
import dotenv from 'dotenv'
import SessionManager from './SessionManager'

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sessionManager = new SessionManager(io)

const port = process.env.PORT_BACKEND ?? 5200
httpServer.listen(port)
logger.info(`Backend ready on port ${port}`)
