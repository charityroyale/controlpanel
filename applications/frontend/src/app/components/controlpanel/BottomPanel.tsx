import React from 'react'
import { FunctionComponent } from 'react'
import { Label, Content } from '../../../pages/controlpanel'
import { styled } from '../../styles/Theme'
import { RiListSettingsFill } from 'react-icons/ri'

export const BottomPanel: FunctionComponent = () => {
	return (
		<GridBottomPanel>
			<Label>
				<IconWrapper>
					<RiListSettingsFill size="16px" style={{ marginRight: '6px' }} />
				</IconWrapper>
				Position Presets
			</Label>
			<Content>TBA</Content>
		</GridBottomPanel>
	)
}

const IconWrapper = styled.span`
	display: flex;
	align-items: center;
	* {
		color: ${(p) => p.theme.color.recordRed};
	}
`

export const GridBottomPanel = styled.div`
	background-color: ${(p) => p.theme.color.background};
	grid-area: bottom-panel;
`
