import React, { FunctionComponent, useCallback } from 'react'
import { styled } from '../../../styles/Theme'
import { ImLock, ImUnlocked } from 'react-icons/im'
import { CHARACTER_UPDATE } from '@pftp/common'
import { useSocket } from '../../../hooks/useSocket'
import ReactTooltip from 'react-tooltip'

const iconSize = '14px'
export const LockCharacterPositionButton: FunctionComponent<{ isLocked: boolean }> = ({ isLocked }) => {
	const { socket } = useSocket()

	const emiteCharacterIsLocked = useCallback(() => {
		socket?.emit(CHARACTER_UPDATE, {
			isLocked: !isLocked,
		})
	}, [socket, isLocked])

	return (
		<LabelButton
			aria-label="Lock character position"
			onClick={emiteCharacterIsLocked}
			data-tip="Lock character position."
			data-border-color="#049EE7"
			data-border={true}
			data-effect="solid"
			data-delay-show={500}
		>
			<ReactTooltip />
			<IconWrapper>{isLocked ? <ImLock size={iconSize} /> : <ImUnlocked size={iconSize} />}</IconWrapper>
		</LabelButton>
	)
}

const LabelButton = styled.button`
	border: none;
	background-color: transparent;
	cursor: pointer;
`

const IconWrapper = styled.span`
	display: flex;
	align-items: center;
`
