import React, { useCallback, useState } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { MainLayout } from '../../app/layout/Layout'
import { PageWithLayoutType } from '../../app/layout/PageWithLayout'
import { useSocket } from '../../app/hooks/useSocket'
import { Donation, DONATION_TRIGGER } from '@pftp/common'
import { withSession, ServerSideHandler } from '../../app/lib/session'
import { UserDTO } from '../api/sessions'
import { Header } from '../../app/components/controlpanel/Header'
import { SocketAuth } from '../../app/provider/SocketProvider'
import { generateSocketAuthForUser } from '../../app/lib/socketUtils'

export interface TestUIPageProps {
	title: string
	user: UserDTO
	auth: SocketAuth
}

const TestUIPage: NextPage<TestUIPageProps> = (props: TestUIPageProps) => {
	const { title, user } = props
	const [message, setMessage] = useState('')
	const { socket } = useSocket()

	const emitRandomDonation = useCallback(() => {
		const precision = 2
		const maxAmount = 6000
		const randomnum =
			Math.floor(Math.random() * (maxAmount * precision - 1 * precision) + 1 * precision) / (1 * precision)

		const a = ['Test1', 'Test2', 'Test3']
		const b = ['Veni', 'FraunzZZZZZZZ', 'Birgit', 'PatrickKKKKKKK', 'Alex', 'MrY']

		const rA = Math.floor(Math.random() * a.length)
		const rB = Math.floor(Math.random() * b.length)
		const name = a[rA] + b[rB]

		const testMessages = [
			'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
			'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy ei',
			'',
			'Lorem ipsum dolor sit amet, consetetur sadipscingddd elitr, sed diam nonumy ei Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy ei',
		]
		const message = testMessages[Math.floor(Math.random() * testMessages.length)]

		const donation: Donation = {
			user: name,
			amount: randomnum,
			timestamp: new Date().getUTCMilliseconds(),
			streamer: '',
			message,
		}

		socket?.emit(DONATION_TRIGGER, donation)
	}, [socket])

	const emitDonationByButtonValue = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			const donation: Donation = {
				user: 'MyBigAssLasagna',
				amount: Number(e.currentTarget.value),
				timestamp: new Date().getUTCMilliseconds(),
				streamer: '',
				message,
			}

			socket?.emit(DONATION_TRIGGER, donation)
		},
		[socket, message]
	)

	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
			<Header user={user}>Header</Header>
			<div>
				<button onClick={emitRandomDonation} style={{ color: 'black' }}>
					Random donation
				</button>

				<button onClick={emitDonationByButtonValue} value="2" style={{ color: 'black' }}>
					2€
				</button>

				<button onClick={emitDonationByButtonValue} value="10" style={{ color: 'black' }}>
					10€
				</button>

				<button onClick={emitDonationByButtonValue} value="500" style={{ color: 'black' }}>
					500€
				</button>

				<button onClick={emitDonationByButtonValue} value="1000" style={{ color: 'black' }}>
					1000€
				</button>

				<textarea
					onChange={(e) => setMessage(e.currentTarget.value)}
					value={message}
					style={{ color: 'black' }}
					maxLength={200}
				></textarea>
			</div>
		</>
	)
}

export const getServerSideProps: GetServerSideProps<TestUIPageProps> = withSession<ServerSideHandler>(
	async ({ req, res }) => {
		const user = req.session.get('user') as UserDTO

		if (!user) {
			res.statusCode = 404
			res.end()
			return { props: {} as TestUIPageProps }
		}

		return {
			props: {
				title: 'TestUI',
				user,
				auth: generateSocketAuthForUser(user, 'readwrite'),
			},
		}
	}
)
;(TestUIPage as PageWithLayoutType).layout = MainLayout

export default TestUIPage
