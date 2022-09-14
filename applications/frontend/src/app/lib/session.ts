import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler } from 'next'
import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next'
import { UserDTO } from '../../pages/api/sessions'

export interface UserSessionData {
	user?: UserDTO
}

const sessionOptions = {
	cookieName: 'pftp',
	cookieOptions: {
		secure: process.env.NODE_ENV === 'production' ? true : false,
	},
	password: process.env.APPLICATION_SECRET!,
}

export function withSessionRoute(handler: NextApiHandler) {
	return withIronSessionApiRoute(handler, sessionOptions)
}

// Theses types are compatible with InferGetStaticPropsType https://nextjs.org/docs/basic-features/data-fetching#typescript-use-getstaticprops
export function withSessionSsr<P extends { [key: string]: unknown } = { [key: string]: unknown }>(
	handler: (context: GetServerSidePropsContext) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
	return withIronSessionSsr(handler, sessionOptions)
}
