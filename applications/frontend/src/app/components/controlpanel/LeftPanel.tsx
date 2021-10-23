import React from 'react'
import { FunctionComponent } from 'react'
import { Label, Content } from '../../../pages/controlpanel'
import { styled } from '../../styles/Theme'
import { FatButton } from './FatButton'
import { AiFillEye } from 'react-icons/ai/index'

export const LeftPanel: FunctionComponent = () => {
	return (
		<GridLeftPanel>
			<Label>Layers</Label>
			<Content>
				<FatButton icon={<AiFillEye size="24px" />} active={false}>
					<span>Pig Visible</span>
				</FatButton>
			</Content>
		</GridLeftPanel>
	)
}

export const GridLeftPanel = styled.div`
	background-color: ${(p) => p.theme.color.background};
	grid-area: left-panel;
`
