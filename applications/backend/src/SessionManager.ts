import { PFTPSocketEventsMap, SocketJwtPayload } from '@pftp/common'
import { Server, Socket } from 'socket.io'
import Session from './Session'
import { sessionLogger as logger } from './logger'
import jwt from 'jsonwebtoken'

export default class SessionManager {
	private readonly sessions = new Map<string, Session>()

	constructor(private readonly io: Server<PFTPSocketEventsMap>, private readonly jwtSecret: string) {
		io.on('connection', async (socket) => {
			logger.info(`New connection from ${socket.id}!`)
			logger.debug(`auth: ${JSON.stringify(socket.handshake.auth)}`)

			const channel = socket.handshake.auth.channel
			if (typeof channel !== 'string') {
				logger.info('Connection without channel information - closing')
				socket.disconnect()
				return
			}

			const writeAccess = this.checkPermissions(socket)
			const session = this.getOrCreateSession(channel)

			logger.info(`Handle new connection for channel ${channel} (writeAccess: ${writeAccess}, id: ${socket.id})`)
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

	private checkPermissions(socket: Socket<PFTPSocketEventsMap, PFTPSocketEventsMap>) {
		if (typeof socket.handshake.auth.token === 'string') {
			try {
				const auth = jwt.verify(socket.handshake.auth.token, this.jwtSecret) as SocketJwtPayload
				logger.debug(`JWT payload: ${JSON.stringify(auth)}`)
				return auth.mode === 'readwrite'
			} catch {
				logger.info(`Could not verify auth`)
			}
		}
		return false
	}
}
