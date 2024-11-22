/* eslint-disable jsx-a11y/accessible-emoji */
import { GlobalState } from '@cp/common'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FunctionComponent } from 'react'
import { Label, Content } from '../../../../pages/controlpanel'
import styled from 'styled-components'
import { CopyBrowserSourceButton } from './CopyBrowserSourceButton'
import { SocketAuth } from '../../../provider/SocketProvider'
import { LockOverlay } from './LockOverlay'

export const CenterPanel: FunctionComponent<
	React.PropsWithChildren<{ globalState: GlobalState; auth: SocketAuth }>
> = ({ auth, globalState }) => {
	const contentRef = useRef<null | HTMLDivElement>(null)
	const [scale, setScale] = useState(0)

	const updateIframeSize = useCallback(() => {
		if (contentRef.current) {
			const { offsetHeight } = contentRef.current
			const newHeightScale = offsetHeight / 1080
			setScale(Number(newHeightScale.toFixed(10)))
		}
	}, [])

	useEffect(() => {
		updateIframeSize()
	}, [updateIframeSize])

	useEffect(() => {
		window.addEventListener('resize', updateIframeSize)
		return () => window.removeEventListener('resize', updateIframeSize)
	}, [updateIframeSize])

	return (
		<GridCenterPanel>
			<Label style={{ justifyContent: 'space-between', paddingRight: 0 }}>
				<div>
					<LiveEmoji role="img" aria-label="Live-Icon">
						🔴
					</LiveEmoji>
					StreamView
				</div>
				<PanelButtonWrapper>
					<OverlayLinkPreview href={`${window.location.origin}/overlay/${auth.channel}`} target="_blank">
						{window.location.origin + '/overlay/' + auth.channel}
					</OverlayLinkPreview>
					<CopyBrowserSourceButton title={'Copy overlay URL'} $username={auth.channel} />
					<LockOverlay $isLocked={globalState.settings.isLockedOverlay} title={'Lock overlay'} />
				</PanelButtonWrapper>
			</Label>
			<Content ref={contentRef} style={{ padding: 0, position: 'relative', backgroundColor: 'black' }}>
				<OverlayIframe
					title="overlay"
					src={`/overlay/${auth.channel}?unlocked=true&token=${auth.token}`}
					height={1080}
					width={1920}
					scale={scale}
				></OverlayIframe>
			</Content>
		</GridCenterPanel>
	)
}

const OverlayLinkPreview = styled.a`
	font-size: 12px;
	display: none;
	${(p) => p.theme.media.tablet} {
		display: inline-block;
	}
`

const PanelButtonWrapper = styled.div`
	display: flex;
	align-items: center;
`

const OverlayIframe = styled.iframe<{ scale: number }>`
	border: none;
	display: block;
	position: absolute;
	left: 50%;
	transform: scale(${(p) => p.scale}) translateX(-50%);
	transform-origin: 0 0;
	background-color: #18181b;
	background-image: url('/charity_royale_logo.png');
	background-blend-mode: overlay;
	background-repeat: no-repeat;
	background-position: center;
	background-size: 35%;
`

const LiveEmoji = styled.span`
	font-size: ${(p) => p.theme.fontSize.s}px;
	margin-right: ${(p) => p.theme.space.xs}px;
`

export const GridCenterPanel = styled.div`
	grid-area: center-panel;
	aspect-ratio: 16/9;
`
