/* eslint-disable jsx-a11y/accessible-emoji */
import { GlobalState } from '@pftp/common'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FunctionComponent } from 'react'
import { Label, Content } from '../../../../pages/controlpanel'
import { responsiveMaxSizeThreshold, styled } from '../../../styles/Theme'
import { LockCharacterPositionButton } from './LockCharacterPositionButton'

export const CenterPanel: FunctionComponent<{ globalState: GlobalState }> = ({ globalState }) => {
	const contentRef = useRef<null | HTMLDivElement>(null)
	const [scale, setScale] = useState(0)

	const updateIframeSize = useCallback(() => {
		if (contentRef.current) {
			const { offsetHeight } = contentRef.current
			let newHeightScale
			if (window.screen.width <= responsiveMaxSizeThreshold.phone) {
				// Mobile iFrame hack
				newHeightScale = (offsetHeight - 8) / 1080
			} else {
				newHeightScale = offsetHeight / 1080
			}

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
					Pigview
				</div>

				<LockCharacterPositionButton isLocked={globalState.character.isLocked} />
			</Label>
			<Content ref={contentRef} style={{ padding: 0 }}>
				<OverlayIframe
					title="overlay"
					src="/overlay?unlocked=true"
					height={1080}
					width={1920}
					scale={scale}
				></OverlayIframe>
			</Content>
		</GridCenterPanel>
	)
}

const OverlayIframe = styled.iframe<{ scale: number }>`
	border: none;
	display: block;
	transform: scale(${(p) => p.scale});
	transform-origin: 0 0;
`

const LiveEmoji = styled.span`
	font-size: ${(p) => p.theme.fontSize.s}px;
	margin-right: ${(p) => p.theme.space.xs}px;
`

export const GridCenterPanel = styled.div`
	background-color: ${(p) => p.theme.color.background};
	grid-area: center-panel;
	aspect-ratio: 16/9;
`
