import { NextApiRequest, NextApiResponse } from 'next'
import { UserSessionData, withSessionRoute } from '../../app/lib/session'

const APPLICATION_PASSWORD = process.env.APPLICATION_PASSWORD
export interface UserDTO {
	username: string
}

// eslint-disable-next-line import/no-default-export
const sessionRoute = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {
		const { username, password } = req.body

		if (typeof APPLICATION_PASSWORD === 'string' && password === APPLICATION_PASSWORD) {
			const user: UserDTO = { username }
			const userSession = req.session as UserSessionData
			userSession.user = user
			await req.session.save()
			return res.status(201).send('')
		}

		return res.status(403).send('')
	}

	return res.status(404).send('')
}

// eslint-disable-next-line import/no-default-export
export default withSessionRoute(sessionRoute)
