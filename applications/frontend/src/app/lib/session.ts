import { GetServerSideProps, GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'
import { withIronSession, Session } from 'next-iron-session'

type NextIronRequest = NextApiRequest & { session: Session }
type ServerSideContext = GetServerSidePropsContext & { req: NextIronRequest }

export type ApiHandler = (req: NextIronRequest, res: NextApiResponse) => Promise<void>

export type ServerSideHandler = (context: ServerSideContext) => ReturnType<GetServerSideProps>

/* https://github.com/vvo/next-iron-session/issues/368#issuecomment-890323102 */
export const withSession = <T extends ApiHandler | ServerSideHandler>(handler: T) =>
	withIronSession(handler, {
		cookieName: 'pftp',
		cookieOptions: {
			secure: process.env.NODE_ENV === 'production' ? true : false,
		},
		password: process.env.APPLICATION_SECRET!,
	})
