import React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { MainLayout } from '../../app/layout/Layout'
import { PageWithLayoutType } from '../../app/layout/PageWithLayout'
import styled from 'styled-components'
import { Overlay } from '../../app/components/overlay/Overlay'

export interface OverlayPageProps {
	title: string
	isLockedInteraction: boolean
}

const OverlayWrapper = styled.div`
	width: 1920px;
	height: 1080px;
`

const OverlayPage: NextPage<OverlayPageProps> = (props: OverlayPageProps) => {
	const { title, isLockedInteraction } = props
	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
			<OverlayWrapper>
				<Overlay />
			</OverlayWrapper>
			{isLockedInteraction && <LockInteraction />}
		</>
	)
}

export const getServerSideProps: GetServerSideProps<OverlayPageProps> = async ({ query }) => {
	return {
		props: {
			title: 'Overlay',
			isLockedInteraction: !(query?.unlocked ? true : false),
		},
	}
}
;(OverlayPage as PageWithLayoutType).layout = MainLayout

const LockInteraction = styled.div`
	position: absolute;
	z-index: 100;
	width: 100%;
	height: 100%;
	top: 0;
`

export default OverlayPage
