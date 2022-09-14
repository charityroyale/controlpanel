import React, { FunctionComponent, ReactElement } from 'react'
import styled from 'styled-components'

interface FatButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
	active?: boolean
	icon?: ReactElement
	value?: string
	children?: ReactElement | string
	disabled?: boolean
}

export const FatButton: FunctionComponent<React.PropsWithChildren<FatButtonProps>> = ({
	children,
	active,
	icon,
	value,
	disabled,
	...props
}: FatButtonProps) => {
	return (
		<Button {...props} value={value} isActive={active ? true : false} disabled={disabled}>
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

	&:not(:disabled) {
		cursor: pointer;
	}

	* {
		color: ${(p) => (p.isActive ? p.theme.color.white : 'rgba(255, 255, 255, 0.2)')};
	}
`
