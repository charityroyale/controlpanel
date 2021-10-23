import React, { FunctionComponent, ReactElement, useCallback, useState } from 'react'
import { styled } from '../../styles/Theme'

interface FatButtonProps {
	active: boolean
	icon: ReactElement
	children?: ReactElement
}

export const FatButton: FunctionComponent<FatButtonProps> = ({ children, active, icon }: FatButtonProps) => {
	const [isActive, setIsActive] = useState(active)

	const onClick = useCallback(() => {
		setIsActive(!isActive)
	}, [isActive])

	return (
		<Button isActive={isActive} onClick={onClick}>
			{icon}
			{children}
		</Button>
	)
}

const Button = styled.button<{ isActive: boolean }>`
	border: none;
	border-radius: ${(p) => p.theme.space.xs}px;
	background-color: ${(p) => (p.isActive ? p.theme.color.willhaben : 'rgba(255, 255, 255, 0.2)')};
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	padding: ${(p) => p.theme.space.m}px ${(p) => p.theme.space.xl}px;
	width: 100%;
	margin-bottom: ${(p) => p.theme.space.s}px;
	cursor: pointer;

	* {
		color: ${(p) => (p.isActive ? p.theme.color.white : 'rgba(255, 255, 255, 0.2)')};
	}
`
