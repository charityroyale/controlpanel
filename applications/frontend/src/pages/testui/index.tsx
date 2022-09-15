import React, { useCallback, useState } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { MainLayout } from '../../app/layout/Layout'
import { PageWithLayoutType } from '../../app/layout/PageWithLayout'
import { useSocket } from '../../app/hooks/useSocket'
import { Donation, DONATION_TRIGGER } from '@cp/common'
import { UserSessionData, withSessionSsr } from '../../app/lib/session'
import { UserDTO } from '../api/sessions'
import { Header } from '../../app/components/controlpanel/Header'
import { SocketAuth } from '../../app/provider/SocketProvider'
import { generateSocketAuthForUser } from '../../app/lib/socketUtils'
import { FatButton } from '../../app/components/controlpanel/FatButton'
import styled from 'styled-components'

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

		const a = ['TestUserA_', 'TestUserB_', 'TestUserC_']
		const b = ['Lasagne', 'StrawBerry', 'Spaghetti']

		const rA = Math.floor(Math.random() * a.length)
		const rB = Math.floor(Math.random() * b.length)
		const name = a[rA] + b[rB]

		const testMessages = [
			'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
			'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy ei',
			'I love you <3!',
			'Lorem ipsum dolor sit amet, consetetur sadipscingddd elitr, sed diam nonumy ei Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy ei',
		]
		const message = testMessages[Math.floor(Math.random() * testMessages.length)]

		const donation: Donation = {
			user: name,
			amount: randomnum,
			timestamp: new Date().getTime() / 1000,
			streamer: '',
			message,
		}

		socket?.emit(DONATION_TRIGGER, donation)
	}, [socket])

	const emitDonationByButtonValue = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			const donation: Donation = {
				user: 'alertUser',
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
			<TestUIMainWrapper>
				<TestUIHeadline>
					<strong>Testing Interface</strong>
				</TestUIHeadline>
				<p>Ab 250+ donation erscheint ein Feuwerk mit Sound</p>
				<p>Ab 500€+ donation erscheint ein Sternenregen</p>
				<p style={{ marginBottom: '24px' }}>
					Wird eine Nachricht mitgeschickt erscheint eine Box über dem Donationalert
				</p>
				<TestUIButtonWrapper style={{ display: 'flex' }}>
					<FatButton onClick={emitRandomDonation} active={true} style={{ color: 'white' }}>
						Random donation
					</FatButton>

					<FatButton onClick={emitDonationByButtonValue} value="2" active={true} style={{ color: 'white' }}>
						2€
					</FatButton>

					<FatButton onClick={emitDonationByButtonValue} value="10" active={true} style={{ color: 'white' }}>
						10€
					</FatButton>
					<FatButton onClick={emitDonationByButtonValue} value="250" active={true} style={{ color: 'white' }}>
						250€
					</FatButton>
					<FatButton onClick={emitDonationByButtonValue} value="500" active={true} style={{ color: 'white' }}>
						500€
					</FatButton>
				</TestUIButtonWrapper>
				<TestUIMessageWrapper>
					<p style={{ marginBottom: '8px' }}>
						Nachricht{' '}
						<span style={{ fontSize: '12px' }}>
							(wird automatisch nach Button click mitgeschickt. Max 200 Zeichen.)
						</span>
					</p>
					<textarea
						onChange={(e) => setMessage(e.currentTarget.value)}
						value={message}
						style={{ color: 'black', width: '100%' }}
						maxLength={200}
						rows={15}
					></textarea>
				</TestUIMessageWrapper>
			</TestUIMainWrapper>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = withSessionSsr(async ({ req, res }) => {
	const user = (req.session as UserSessionData).user

	if (!user) {
		res.statusCode = 404
		res.end()
		return { props: {} }
	}

	const props = {
		title: 'Demo | Charity Royale',
		user,
		auth: generateSocketAuthForUser(user, 'readwrite'),
	}

	return {
		props,
	}
})
;(TestUIPage as PageWithLayoutType).layout = MainLayout

const TestUIButtonWrapper = styled.div`
	display: flex;
	& > button {
		margin: 8px;
	}
`

const TestUIMessageWrapper = styled.div`
	margin: 8px;
`

const TestUIMainWrapper = styled.div`
	max-width: 1000px;
	margin: auto;

	& > p {
		padding-left: 8px;
		padding-right: 8px;
	}
`

const TestUIHeadline = styled.p`
	text-align: center;
	margin-top: 48px;
	margin-bottom: 24px;
	font-size: 24px;
`

export default TestUIPage
