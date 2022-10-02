import React from 'react'
import { FunctionComponent } from 'react'
import { Label, Content } from '../../../pages/controlpanel'
import styled from 'styled-components'
import { RiListSettingsFill } from 'react-icons/ri'

export const BottomPanel: FunctionComponent<React.PropsWithChildren> = () => {
	return (
		<GridBottomPanel>
			<Label>
				<IconWrapper>
					<RiListSettingsFill size="16px" style={{ marginRight: '6px' }} />
				</IconWrapper>
				Setup guide
			</Label>
			<Content>
				<p>1. Embedd browsersource 1920x1080</p>
				<p>2. Mute tab (if open) before going live</p>
			</Content>
		</GridBottomPanel>
	)
}

const IconWrapper = styled.span`
	display: flex;
	align-items: center;
	* {
		color: ${(p) => p.theme.color.charityGold};
	}
`

export const GridBottomPanel = styled.div`
	grid-area: bottom-panel;
`
