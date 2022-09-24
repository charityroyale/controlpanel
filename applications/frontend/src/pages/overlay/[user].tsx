import React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { MainLayout } from '../../app/layout/Layout'
import { PageWithLayoutType } from '../../app/layout/PageWithLayout'
import styled from 'styled-components'
import { Overlay } from '../../app/components/overlay/Overlay'
import { SocketAuth } from '../../app/provider/SocketProvider'

export interface OverlayPageProps {
	title: string
	isLockedInteraction: boolean
	auth: SocketAuth
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
				<style>{'\
				body{\
					background-color: transparent !important;\
				}\
			'}</style>
			</Head>
			<OverlayWrapper>
				<Overlay />
				<HiddenTTS>
					<figcaption>TTS</figcaption>
					<audio controls src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tts`}>
						<a href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tts`}>Download audio</a>
						<track kind="captions" />
					</audio>
				</HiddenTTS>
			</OverlayWrapper>
			<div
				style={{
					fontFamily: 'Saira Condensed, Roboto,Luckiest Guy',
					position: 'absolute',
					left: '-99999',
					visibility: 'hidden',
					top: '0px',
				}}
			>
				.
			</div>
			{isLockedInteraction && <LockInteraction />}
		</>
	)
}

const HiddenTTS = styled.figure`
	position: absolute;
	visibility: hidden;
`

export const getServerSideProps: GetServerSideProps<OverlayPageProps> = async ({ query, params }) => {
	const auth: SocketAuth = { channel: params!.user as string }
	if (query && typeof query.token === 'string') {
		auth.token = query.token
	}

	return {
		props: {
			title: 'Overlay | Charity Royale',
			isLockedInteraction: !(query?.unlocked ? true : false),
			auth,
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
