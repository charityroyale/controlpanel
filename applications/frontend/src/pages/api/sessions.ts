import { NextApiRequest, NextApiResponse } from 'next'
import { obtainIronSession, UserSessionData } from '../../app/lib/session'

const MAIN_APPLICATION_PASSWORD = process.env.MAIN_APPLICATION_PASSWORD
const COMMUNITY_APPLICATION_PASSWORD = process.env.COMMUNITY_APPLICATION_PASSWORD
export interface UserDTO {
	username: string
}

// eslint-disable-next-line import/no-default-export
const sessionRoute = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {
		const { username, password, type } = req.body
		const session = await obtainIronSession(req, res)
		if (
			(typeof MAIN_APPLICATION_PASSWORD === 'string' && password === MAIN_APPLICATION_PASSWORD && type === 'main') ||
			(typeof COMMUNITY_APPLICATION_PASSWORD === 'string' &&
				password === COMMUNITY_APPLICATION_PASSWORD &&
				type === 'community')
		) {
			const user: UserDTO = { username }
			const userSession = session as UserSessionData
			userSession.user = user
			await session.save()
			return res.status(201).send('')
		}

		return res.status(403).send('')
	}

	return res.status(404).send('')
}

// eslint-disable-next-line import/no-default-export
export default sessionRoute
