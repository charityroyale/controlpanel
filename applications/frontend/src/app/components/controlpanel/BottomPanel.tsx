import React from 'react'
import { FunctionComponent } from 'react'
import { Label, Content } from '../../../pages/controlpanel'
import styled from 'styled-components'
import { RiListSettingsFill } from 'react-icons/ri'
import { GlobalState } from '@cp/common'
import { useSocket } from '../../hooks/useSocket'

export const BottomPanel: FunctionComponent<React.PropsWithChildren<{ globalState: GlobalState }>> = ({
	globalState,
}) => {
	const { socket } = useSocket()

	// TBA
	console.log(socket)
	console.log(globalState)
	return (
		<GridBottomPanel>
			<Label>
				<IconWrapper>
					<RiListSettingsFill size="16px" style={{ marginRight: '6px' }} />
				</IconWrapper>
				Other Settings
			</Label>
			<Content>TBA</Content>
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
