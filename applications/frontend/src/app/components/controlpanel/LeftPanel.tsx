import React, { useCallback } from 'react'
import { FunctionComponent } from 'react'
import { Label, Content } from '../../../pages/controlpanel'
import { styled } from '../../styles/Theme'
import { FatButton } from './FatButton'
import { AiFillEye } from 'react-icons/ai/index'
import { FaPiggyBank } from 'react-icons/fa'
import { CHARACTER_UPDATE, GlobalState } from '@pftp/common'
import { useSocket } from '../../hooks/useSocket'

export const LeftPanel: FunctionComponent<{ globalState: GlobalState }> = ({ globalState }) => {
	const { socket } = useSocket()

	const emitCharacterIsVisibleUpdate = useCallback(() => {
		socket?.emit(CHARACTER_UPDATE, {
			isVisible: !globalState.character.isVisible,
		})
	}, [globalState.character.isVisible, socket])

	return (
		<GridLeftPanel>
			<Label>
				<IconWrapper>
					<FaPiggyBank size="14px" color="#D8B864" style={{ marginRight: '6px' }} />
				</IconWrapper>
				Character
			</Label>
			<Content>
				<FatButton
					icon={<AiFillEye size="24px" />}
					active={globalState.character.isVisible}
					value={globalState?.character.isVisible === true ? 'true' : 'false'}
					onClick={emitCharacterIsVisibleUpdate}
				>
					<span>Pig Visible</span>
				</FatButton>
			</Content>
		</GridLeftPanel>
	)
}

const IconWrapper = styled.span`
	display: flex;
	align-items: center;
	* {
		color: #d8b864;
	}
`

export const GridLeftPanel = styled.div`
	background-color: ${(p) => p.theme.color.background};
	grid-area: left-panel;
`
