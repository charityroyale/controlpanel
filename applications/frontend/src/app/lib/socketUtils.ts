import { WebSocketJwtPayload } from '@pftp/common'
import { UserDTO } from '../../pages/api/sessions'
import { SocketAuth } from '../provider/SocketProvider'
import jwt from 'jsonwebtoken'

export function generateSocketAuthForUser(user: UserDTO, mode: 'readwrite' | 'read') {
	const jwtPayload: WebSocketJwtPayload = {
		channel: user.username,
		mode,
	}

	const auth: SocketAuth = {
		token: jwt.sign(jwtPayload, process.env.WEBSOCKET_AUTH_SECRET ?? 'secret'),
		channel: user.username,
	}

	return auth
}
