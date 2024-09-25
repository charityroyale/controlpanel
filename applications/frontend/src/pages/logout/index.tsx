import { GetServerSideProps } from 'next'
import { obtainIronSession } from '../../app/lib/session'

const LogoutPage = () => {
	return null
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	const session = await obtainIronSession(req, res)
	session.destroy()
	res.writeHead(301, { Location: '/login' })
	res.end()
	return { props: {} }
}

export default LogoutPage
