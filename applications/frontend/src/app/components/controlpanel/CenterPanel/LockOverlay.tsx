import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components'
import { ImLock, ImUnlocked } from 'react-icons/im'
import { useSocket } from '../../../hooks/useSocket'

interface LockOverlayProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	isLocked: boolean
}

const iconSize = '14px'
// TODO: move isLocked to settings
export const LockOverlay: FunctionComponent<LockOverlayProps> = (props) => {
	const { isLocked } = props
	const { socket } = useSocket()

	// TODO: move isLocked to settings
	const emiteCharacterIsLocked = useCallback(() => {
		// socket?.emit(CHARACTER_UPDATE, {
		//	isLocked: !isLocked,
		// })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket, isLocked])

	return (
		<LabelButton aria-label="Lock Overlay" onClick={emiteCharacterIsLocked} {...props}>
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
