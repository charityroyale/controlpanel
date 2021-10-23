import React from 'react'
import { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import { MainLayout } from '../../app/layout/Layout'
import { PageWithLayoutType } from '../../app/layout/PageWithLayout'
import { styled } from '../../app/styles/Theme'
import { Header } from '../../app/components/controlpanel/Header'
import { LeftPanel } from '../../app/components/controlpanel/LeftPanel'
import { CenterPanel } from '../../app/components/controlpanel/CenterPanel'
import { BottomPanel, GridBottomPanel } from '../../app/components/controlpanel/BottomPanel'
import { RightPanel } from '../../app/components/controlpanel/RightPanel'
export interface ControlPanelPageProps {
	title?: string
}

const ControlPanelPage: NextPage<ControlPanelPageProps> = (props: ControlPanelPageProps) => {
	const { title } = props

	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>

			<Grid>
				<Header>Header</Header>
				<LeftPanel>Left-Panel</LeftPanel>
				<CenterPanel>Center-Panel</CenterPanel>
				<RightPanel>Right-Panel</RightPanel>
				<BottomPanel>Bottom-Panel</BottomPanel>
			</Grid>
		</>
	)
}

export const getStaticProps: GetStaticProps<ControlPanelPageProps> = async () => {
	return {
		props: {
			title: 'Controlpanel',
		},
	}
}
;(ControlPanelPage as PageWithLayoutType).layout = MainLayout

const Grid = styled.div`
	display: grid;
	height: 100vh;

	& > div:not(${GridBottomPanel}) {
		border-bottom: 1px solid ${(p) => p.theme.color.willhaben};
	}

	// Mobile
	grid-template-columns: 1fr;
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
			'center-panel center-panel '
			'left-panel  right-panel'
			'bottom-panel  bottom-panel';

		// Left-Panel
		& > div:nth-child(2) {
			border-right: 1px solid ${(p) => p.theme.color.willhaben};
		}
	}

	${(p) => p.theme.media.desktop} {
		grid-template-columns: 1fr minmax(500px, 3fr) 1fr;
		grid-auto-rows: 50px auto 1fr;
		grid-template-areas:
			'header header header'
			'left-panel center-panel right-panel'
			'left-panel bottom-panel right-panel';

		// Right-Panel
		& > div:nth-child(4) {
			border-left: 1px solid ${(p) => p.theme.color.willhaben};
			border-bottom: 0;
		}

		// Left-Panel
		& > div:nth-child(2) {
			border-bottom: 0;
		}
	}
`

export const Label = styled.div`
	background-color: ${(p) => p.theme.color.highlighbackground};
	font-size: ${(p) => p.theme.fontSize.m}px;
	padding: ${(p) => p.theme.space.xs}px ${(p) => p.theme.space.m}px;
	display: flex;
	align-items: center;
`

export const Content = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: ${(p) => p.theme.space.s}px;
	height: 100%;
`

export default ControlPanelPage
