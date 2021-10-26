import { withSession } from '../../app/lib/session'

const USER_PASSWORD = process.env.PASSWORD

export interface UserDTO {
	username: string
}

// eslint-disable-next-line import/no-default-export
export default withSession(async (req, res) => {
	if (req.method === 'POST') {
		const { username, password } = req.body

		if (typeof USER_PASSWORD === 'string' && password === USER_PASSWORD) {
			const user: UserDTO = { username }
			req.session.set('user', user)
			await req.session.save()
			return res.status(201).send('')
		}

		return res.status(403).send('')
	}

	return res.status(404).send('')
})
