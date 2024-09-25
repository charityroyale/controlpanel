import React from 'react'
import { NextPage, GetServerSideProps } from 'next'
import Head from 'next/head'
import { PageWithLayoutType } from '../app/layout/PageWithLayout'
import { MainLayout } from '../app/layout/Layout'
import styled from 'styled-components'
import { obtainIronSession, UserSessionData } from '../app/lib/session'
import { UserDTO } from './api/sessions'
import { Header } from '../app/components/controlpanel/Header'
import { SocketAuth } from '../app/provider/SocketProvider'
import { generateSocketAuthForUser } from '../app/lib/socketUtils'

export interface StartPageProps {
	title?: string
	user: UserDTO
	auth: SocketAuth
}

const IndexPage: NextPage<StartPageProps> = (props: StartPageProps) => {
	const { title, user } = props
	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
			<Header user={user}>Header</Header>
			<StartPage>
				<StartPageContent>
					<img src="/charity_royale_logo.png" alt="Logo" />
					<ButtonsWrapper>
						<LinkAsButton href="/controlpanel" style={{ marginRight: '4px', marginLeft: '0' }}>
							<span>Control Panel</span>
						</LinkAsButton>
						<LinkAsButton href={`/overlay/${props.auth.channel}`} target="_blank">
							<span>Browser Source</span>
						</LinkAsButton>
					</ButtonsWrapper>
					<LinkAsButton
						href="/testui"
						target="_blank"
						style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', marginTop: '8px', marginLeft: '0' }}
					>
						<span>Testing UI for Demos</span>
					</LinkAsButton>
				</StartPageContent>
			</StartPage>
		</>
	)
}
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	const session = await obtainIronSession(req, res)
	const user = (session as UserSessionData).user

	if (!user) {
		res.writeHead(301, { Location: '/login' })
		res.end()
		return { props: {} }
	}

	const props = {
		title: 'Home | Charity Royale',
		user,
		auth: generateSocketAuthForUser(user, 'read'),
	}

	return {
		props,
	}
}
;(IndexPage as PageWithLayoutType).layout = MainLayout

const LinkAsButton = styled.a`
	border: none;
	border-radius: ${(p) => p.theme.space.xs}px;
	background-color: ${(p) => p.theme.color.willhaben};
	display: flex;
	align-items: center;
	justify-content: center;
	padding: ${(p) => p.theme.space.xs}px ${(p) => p.theme.space.xs}px;
	margin-left: ${(p) => p.theme.space.xs}px;
	padding: ${(p) => p.theme.space.m}px ${(p) => p.theme.space.xl}px;
	text-decoration: none;
	font-size: ${(p) => p.theme.fontSize.m}px;
	width: 100%;
	white-space: nowrap;
`

const StartPage = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: calc(100% - 300px);
`

const StartPageContent = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
`

const ButtonsWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: ${(p) => p.theme.space.xl}px;
`

export default IndexPage
