/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react'
import { FunctionComponent } from 'react'
import { Label, Content } from '../../../pages/controlpanel'
import { styled } from '../../styles/Theme'

export const CenterPanel: FunctionComponent = () => {
	return (
		<GridCenterPanel>
			<Label>
				<LiveEmoji role="img" aria-label="Live-Icon">
					🔴
				</LiveEmoji>
				Pigview
			</Label>
			<Content>
				<iframe title="overlay" src="/overlay"></iframe>
			</Content>
		</GridCenterPanel>
	)
}

const LiveEmoji = styled.span`
	font-size: ${(p) => p.theme.fontSize.s}px;
	margin-right: ${(p) => p.theme.space.xs}px;
`

const GridCenterPanel = styled.div`
	background-color: ${(p) => p.theme.color.background};
	grid-area: center-panel;
	aspect-ratio: 16/9;
`
