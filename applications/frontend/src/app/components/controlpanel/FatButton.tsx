import React, { FunctionComponent, ReactElement } from 'react'
import { styled } from '../../styles/Theme'

interface FatButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
	active?: boolean
	icon?: ReactElement
	value?: string
	children?: ReactElement
}

export const FatButton: FunctionComponent<FatButtonProps> = ({
	children,
	active,
	icon,
	value,
	...props
}: FatButtonProps) => {
	return (
		<Button {...props} value={value} isActive={active ? true : false}>
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
	cursor: pointer;

	* {
		color: ${(p) => (p.isActive ? p.theme.color.white : 'rgba(255, 255, 255, 0.2)')};
	}
`
