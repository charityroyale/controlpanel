import { withSessionSsr } from '../../app/lib/session'

const LogoutPage = () => {
	return null
}

export const getServerSideProps = withSessionSsr(async ({ req, res }) => {
	req.session.destroy()
	res.writeHead(301, { Location: '/login' })
	res.end()
	return { props: {} }
})

export default LogoutPage
