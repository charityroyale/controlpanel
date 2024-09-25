import { NextApiRequest, NextApiResponse } from 'next'
import { UserDTO } from '../../pages/api/sessions'
import { getIronSession } from 'iron-session'
import { IncomingMessage, ServerResponse } from 'http'

export interface UserSessionData {
	user?: UserDTO
}

const sessionOptions = {
	cookieName: 'charity_royale_cp',
	cookieOptions: {
		secure: process.env.NODE_ENV === 'production' ? true : false,
	},
	password: process.env.APPLICATION_SECRET!,
}

export const obtainIronSession = async (
	req: NextApiRequest | IncomingMessage,
	res: NextApiResponse | ServerResponse<IncomingMessage>
) => {
	return await getIronSession(req, res, sessionOptions)
}
