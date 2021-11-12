import { PFTPSocketEventsMap, WebSocketJwtPayload } from '@pftp/common'
import { Server } from 'socket.io'
import Session from './Session'
import { sessionLogger as logger } from './logger'
import jwt from 'jsonwebtoken'

export default class SessionManager {
	private readonly sessions = new Map<string, Session>()

	constructor(private readonly io: Server<PFTPSocketEventsMap>, jwtSecret: string) {
		io.on('connection', async (socket) => {
			logger.info(`New connection from ${socket.id}!`)
			logger.debug(`auth: ${JSON.stringify(socket.handshake.auth)}`)

			const channel = socket.handshake.auth.channel
			let writeAccess = false

			if (typeof socket.handshake.auth.token === 'string') {
				try {
					const auth = jwt.verify(socket.handshake.auth.token, jwtSecret) as WebSocketJwtPayload
					logger.debug(`JWT payload: ${JSON.stringify(auth)}`)
					writeAccess = auth.mode === 'readwrite'
				} catch {
					logger.info(`could not verify auth`)
				}
			}

			if (typeof channel !== 'string') {
				logger.info('Connection without channel information - closing')
				socket.disconnect()
				return
			}

			const session = this.getOrCreateSession(channel)
			logger.info(`Handle new connection for channel ${channel} (write: ${writeAccess}, id: ${socket.id})`)
			if (writeAccess) {
				await session.handleNewReadWriteConnection(socket)
			} else {
				await session.handleNewReadConnection(socket)
			}
		})
	}

	public getOrCreateSession(channel: string) {
		let session = this.sessions.get(channel)
		if (session === undefined) {
			session = this.createSession(channel)
		}

		return session
	}

	private createSession(channel: string) {
		logger.info(`Create session for channel: ${channel}`)
		const session = new Session(channel, this.io)
		this.sessions.set(channel, session)
		return session
	}
}
