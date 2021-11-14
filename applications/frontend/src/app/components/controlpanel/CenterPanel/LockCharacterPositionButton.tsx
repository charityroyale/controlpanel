import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components'
import { ImLock, ImUnlocked } from 'react-icons/im'
import { CHARACTER_UPDATE } from '@pftp/common'
import { useSocket } from '../../../hooks/useSocket'

interface LockCharacterPositionButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	isLocked: boolean
}

const iconSize = '14px'
export const LockCharacterPositionButton: FunctionComponent<LockCharacterPositionButton> = (props) => {
	const { isLocked } = props
	const { socket } = useSocket()

	const emiteCharacterIsLocked = useCallback(() => {
		socket?.emit(CHARACTER_UPDATE, {
			isLocked: !isLocked,
		})
	}, [socket, isLocked])

	return (
		<LabelButton aria-label="Lock character position" onClick={emiteCharacterIsLocked} {...props}>
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
