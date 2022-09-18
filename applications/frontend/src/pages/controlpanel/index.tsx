import React from 'react'
import { NextPage, GetServerSideProps } from 'next'
import Head from 'next/head'
import { MainLayout } from '../../app/layout/Layout'
import { PageWithLayoutType } from '../../app/layout/PageWithLayout'
import { useGlobalState } from '../../app/hooks/useGlobalState'
import { ControlPanel } from '../../app/components/controlpanel/ControlPanel'
import { UserDTO } from '../api/sessions'
import { SocketAuth } from '../../app/provider/SocketProvider'
import { generateSocketAuthForUser } from '../../app/lib/socketUtils'
import styled from 'styled-components'
import { UserSessionData, withSessionSsr } from '../../app/lib/session'

export interface ControlPanelPageProps {
	title?: string
	user: UserDTO
	auth: SocketAuth
}

const ControlPanelPage: NextPage<ControlPanelPageProps> = (props: ControlPanelPageProps) => {
	const { title, user, auth } = props
	const { globalState } = useGlobalState()

	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>

			<Grid>{globalState && <ControlPanel globalState={globalState} user={user} auth={auth} />}</Grid>
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

	const auth = generateSocketAuthForUser(user, 'readwrite')

	const props = {
		user,
		auth,
		title: 'Control Panel | Charity Royale',
	}

	return {
		props,
	}
})
;(ControlPanelPage as PageWithLayoutType).layout = MainLayout

const Grid = styled.div`
	display: grid;
	height: 100vh;

	grid-auto-rows: 50px auto 1fr 1fr 1fr;
	grid-template-areas:
		'header'
		'center-panel'
		'left-panel'
		'right-panel'
		'bottom-panel';

	${(p) => p.theme.media.tablet} {
		grid-template-columns: 1fr 1fr;
		grid-auto-rows: 50px auto 1fr 1fr;
		grid-template-areas:
			'header header'
			'center-panel center-panel'
			'left-panel  right-panel'
			'bottom-panel  bottom-panel';
	}

	${(p) => p.theme.media.desktop} {
		grid-template-columns: 1fr minmax(500px, 3fr) 1fr;
		grid-auto-rows: 50px auto 1fr;
		grid-template-areas:
			'header header header'
			'left-panel center-panel right-panel'
			'left-panel bottom-panel right-panel';
	}
`

export const Label = styled.div`
	background-color: ${(p) => p.theme.color.highlighbackground};
	font-size: ${(p) => p.theme.fontSize.m}px;
	padding: ${(p) => p.theme.space.xs}px ${(p) => p.theme.space.m}px;
	display: flex;
	align-items: center;
	height: 30px;
`

export const Content = styled.div`
	padding: ${(p) => p.theme.space.s}px;
	height: calc(100% - 30px);

	${(p) => p.theme.media.tablet} {
		max-width: unset;
	}
`

export default ControlPanelPage
