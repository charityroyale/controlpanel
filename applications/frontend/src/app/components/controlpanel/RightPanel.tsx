import React from 'react'
import { FunctionComponent } from 'react'
import { Label, Content } from '../../../pages/controlpanel'
import { styled } from '../../styles/Theme'

export const RightPanel: FunctionComponent = () => {
	return (
		<GridRightPanel>
			<Label>More Settings</Label>
			<Content>TBA</Content>
		</GridRightPanel>
	)
}

const GridRightPanel = styled.div`
	background-color: ${(p) => p.theme.color.background};
	grid-area: right-panel;
`
