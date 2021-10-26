import React from 'react'
import { NextPage, GetServerSideProps } from 'next'
import Head from 'next/head'
import { PageWithLayoutType } from '../app/layout/PageWithLayout'
import { MainLayout } from '../app/layout/Layout'
import { styled } from '../app/styles/Theme'
import { withSession, ServerSideHandler } from '../app/lib/session'
import { UserDTO } from './api/sessions'

export interface StartPageProps {
	title?: string
}

const IndexPage: NextPage<StartPageProps> = (props: StartPageProps) => {
	const { title } = props
	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
			<StartPage>
				<StartPageContent>
					<img src="/charity_royale_logo.png" alt="Logo" />
					<h1>Project: Feed the Pig</h1>

					<ButtonsWrapper>
						<LinkAsButton href="/controlpanel" style={{ marginRight: '8px' }}>
							<span>Control Panel</span>
						</LinkAsButton>
						<LinkAsButton href="/overlay" target="_blank">
							<span>Browser Source</span>
						</LinkAsButton>
					</ButtonsWrapper>
				</StartPageContent>
			</StartPage>
		</>
	)
}

export const getServerSideProps: GetServerSideProps<StartPageProps> = withSession<ServerSideHandler>(
	async ({ req, res }) => {
		const user = req.session.get('user') as UserDTO

		if (!user) {
			res.writeHead(301, { Location: '/login' })
			res.end()
			return { props: {} as StartPageProps }
		}

		return {
			props: { title: 'Project: Feed the Pig' },
		}
	}
)
;(IndexPage as PageWithLayoutType).layout = MainLayout

const LinkAsButton = styled.a`
	border: none;
	border-radius: ${(p) => p.theme.space.xs}px;
	background-color: ${(p) => p.theme.color.willhaben};
	display: flex;
	align-items: center;
	padding: ${(p) => p.theme.space.xs}px ${(p) => p.theme.space.xs}px;
	margin-left: ${(p) => p.theme.space.s}px;
	padding: ${(p) => p.theme.space.m}px ${(p) => p.theme.space.xl}px;
	text-decoration: none;
	font-size: ${(p) => p.theme.fontSize.m}px;
`

const StartPage = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;

	background-color: ${(p) => p.theme.color.background};
`

const StartPageContent = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin-top: -200px;
`

const ButtonsWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`

export default IndexPage
