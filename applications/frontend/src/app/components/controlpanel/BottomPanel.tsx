import React from 'react'
import { FunctionComponent } from 'react'
import { Label, Content } from '../../../pages/controlpanel'
import { styled } from '../../styles/Theme'

export const BottomPanel: FunctionComponent = () => {
	return (
		<GridBottomPanel>
			<Label>Preview Settings</Label>
			<Content>TBA</Content>
		</GridBottomPanel>
	)
}

export const GridBottomPanel = styled.div`
	background-color: ${(p) => p.theme.color.background};
	grid-area: bottom-panel;
`
