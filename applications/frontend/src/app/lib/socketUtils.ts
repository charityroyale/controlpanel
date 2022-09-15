import { SocketJwtPayload } from '@cp/common'
import { UserDTO } from '../../pages/api/sessions'
import { SocketAuth } from '../provider/SocketProvider'
import jwt from 'jsonwebtoken'

export function generateSocketAuthForUser(user: UserDTO, mode: 'readwrite' | 'read') {
	const jwtPayload: SocketJwtPayload = {
		channel: user.username,
		mode,
	}

	const auth: SocketAuth = {
		token: jwt.sign(jwtPayload, process.env.SOCKETIO_AUTH_SECRET ?? 'secret'),
		channel: user.username,
	}

	return auth
}
