import React from 'react'
import { NextPage, GetServerSideProps } from 'next'
import Head from 'next/head'
import { PageWithLayoutType } from '../app/layout/PageWithLayout'
import { MainLayout } from '../app/layout/Layout'
import { FatButton } from '../app/components/controlpanel/FatButton'
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
						<FatButton
							active={true}
							style={{ marginRight: '8px' }}
							onClick={() => window.open('/controlpanel', '_blank')}
						>
							<span>Control Panel</span>
						</FatButton>
						<FatButton active={true} onClick={() => window.open('/overlay', '_blank')}>
							<span>Browser Source</span>
						</FatButton>
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
			res.statusCode = 404
			res.end()
			return { props: {} as StartPageProps }
		}

		return {
			props: { title: 'Project: Feed the Pig' },
		}
	}
)
;(IndexPage as PageWithLayoutType).layout = MainLayout

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
