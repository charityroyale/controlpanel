import React, { useState } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { MainLayout } from '../../app/layout/Layout'
import { PageWithLayoutType } from '../../app/layout/PageWithLayout'
import { useSocket } from '../../app/hooks/useSocket'
import { Donation, REQUEST_DONATION_TRIGGER } from '@cp/common'
import { obtainIronSession, UserSessionData } from '../../app/lib/session'
import { UserDTO } from '../api/sessions'
import { Header } from '../../app/components/controlpanel/Header'
import { SocketAuth } from '../../app/provider/SocketProvider'
import { generateSocketAuthForUser } from '../../app/lib/socketUtils'
import { FatButton } from '../../app/components/controlpanel/FatButton'
import styled from 'styled-components'
import { FatInput } from '../../app/components/controlpanel/FatInput'
import {
	ALERT_FIREWORKS_MIN_AMOUNT,
	ALERT_STAR_AND_FIREWORK_MIN_AMOUNT,
	ALERT_STAR_RAIN_MIN_AMOUNT,
} from '../../app/components/overlay/game/objects/containers/donationBanner/donationSpecialEffectsConfig'
import { generateRandomDonation, getRandomId } from '../../app/lib/utils'
import { FatCheckbox } from '../../app/components/controlpanel/FatCheckBox'

export interface TestUIPageProps {
	title: string
	user: UserDTO
	auth: SocketAuth
}

const TestUIPage: NextPage<TestUIPageProps> = (props: TestUIPageProps) => {
	const { title, user } = props
	const [message, setMessage] = useState('Hello, lets make a wish.')
	const { socket } = useSocket()
	const [amount, setAmount] = useState('10')
	const [isFullFilledWish, setIsFullFilledWish] = useState(false)

	const emitRandomDonation = () => {
		const donation = generateRandomDonation((socket?.auth as SocketAuth).channel)
		socket?.emit(REQUEST_DONATION_TRIGGER, donation)
	}

	const emitCustomDonation = () => {
		const donation: Donation = {
			id: getRandomId(),
			user: 'TEST_USER',
			amount: (Number(amount) + 1) * 100,
			amount_net: Number(amount) * 100,
			timestamp: new Date().getTime() / 1000,
			streamer: (socket?.auth as SocketAuth).channel,
			message,
			fullFilledWish: isFullFilledWish,
		}

		socket?.emit(REQUEST_DONATION_TRIGGER, donation)
	}

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
				<p>Ab {ALERT_FIREWORKS_MIN_AMOUNT}€+ donation erscheint ein Feuwerk mit Sound</p>
				<p>Ab {ALERT_STAR_RAIN_MIN_AMOUNT}€+ donation erscheint ein Sternenregenmit Sound</p>
				<p>
					Ab {ALERT_STAR_AND_FIREWORK_MIN_AMOUNT}€+ donation erscheint ein Sternenregen & ein Feuerwerk mit
					Soundüberlagerung
				</p>
				<p>Complete Hakerl faked einen Spende die das Wunschziel erreicht (GTA Respect AlertSound)</p>
				<p style={{ marginBottom: '24px' }}>
					Wird eine Nachricht mitgeschickt erscheint eine Box über dem Donationalert
				</p>
				<TestUIButtonWrapper style={{ display: 'flex' }}>
					<FatButton onClick={emitRandomDonation} active={true} style={{ color: 'white' }}>
						Random donation
					</FatButton>
				</TestUIButtonWrapper>
				<TestUIHeadline>
					<strong>Custom donation</strong>
				</TestUIHeadline>

				<TestUICustomInputWrapper style={{ margin: '0px 8px 24px 8px' }}>
					<FatInput
						label="Custom Amount"
						name="amount"
						value={amount}
						style={{ width: '100%' }}
						onChange={(e) => setAmount(e.currentTarget.value)}
					></FatInput>

					<FatCheckbox
						checked={isFullFilledWish}
						label="Complete"
						name="isWishFullFilled"
						onChange={(e) => setIsFullFilledWish(e.currentTarget.checked)}
					/>
				</TestUICustomInputWrapper>

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

				<TestUIButtonWrapper style={{ display: 'flex' }}>
					<FatButton onClick={emitCustomDonation} active={true} style={{ color: 'white' }}>
						Send Donation
					</FatButton>
				</TestUIButtonWrapper>
			</TestUIMainWrapper>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	const session = await obtainIronSession(req, res)
	const user = (session as UserSessionData).user

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
}
;(TestUIPage as PageWithLayoutType).layout = MainLayout

const TestUICustomInputWrapper = styled.div`
	display: flex;
	& > * {
		width: 100%;
	}
`

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
