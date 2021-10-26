import React, { useCallback } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { MainLayout } from '../../app/layout/Layout'
import { PageWithLayoutType } from '../../app/layout/PageWithLayout'
import { useSocket } from '../../app/hooks/useSocket'
import { DONATION_TRIGGER } from '@pftp/common'
import { withSession, ServerSideHandler } from '../../app/lib/session'
import { UserDTO } from '../api/sessions'

export interface TestUIPageProps {
	title: string
}

const TestUIPage: NextPage<TestUIPageProps> = (props: TestUIPageProps) => {
	const { title } = props
	const { socket } = useSocket()

	const emitDonation = useCallback(() => {
		const precision = 100
		const maxAmount = 10002
		const randomnum =
			Math.floor(Math.random() * (maxAmount * precision - 1 * precision) + 1 * precision) / (1 * precision)

		const a = ['Veni', 'HeideltrautEUW', 'Uglywerwer']
		const b = ['MrYRichardXX120', 'Fraunz', 'AlexanderRR']

		const rA = Math.floor(Math.random() * a.length)
		const rB = Math.floor(Math.random() * b.length)
		const name = a[rA] + b[rB]

		socket?.emit(DONATION_TRIGGER, {
			user: name,
			amount: randomnum,
			timestamp: new Date().toString(),
		})
	}, [socket])

	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
			<div>
				<button onClick={emitDonation} style={{ color: 'black' }}>
					Send random donation
				</button>
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
			props: { title: 'TestUI' },
		}
	}
)
;(TestUIPage as PageWithLayoutType).layout = MainLayout

export default TestUIPage
