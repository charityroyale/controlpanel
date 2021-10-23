import React from 'react'
import { FunctionComponent } from 'react'
import { Label, Content } from '../../../pages/controlpanel'
import { styled } from '../../styles/Theme'

export const LeftPanel: FunctionComponent = () => {
	return (
		<GridLeftPanel>
			<Label>Layers</Label>
			<Content>TBA</Content>
		</GridLeftPanel>
	)
}

export const GridLeftPanel = styled.div`
	background-color: ${(p) => p.theme.color.background};
	grid-area: left-panel;
`
