import React, { FunctionComponent } from 'react'
import styled from 'styled-components'

interface FatInputProps extends React.HTMLAttributes<HTMLInputElement> {
	checked: boolean
	name: string
	label?: string
}

export const FatCheckbox: FunctionComponent<React.PropsWithChildren<FatInputProps>> = ({
	checked,
	name,
	label = '',
	...props
}: FatInputProps) => {
	return (
		<InputWrapper>
			<FatLabel htmlFor={name}>
				<span>{label}</span>
				<Input {...props} checked={checked} name={name} id={name} type="checkbox"></Input>
			</FatLabel>
		</InputWrapper>
	)
}

const InputWrapper = styled.div`
	margin-bottom: ${(p) => p.theme.space.s}px;
	position: relative;
	width: min-content !important;
	margin-left: 12px;
`

const FatLabel = styled.label`
	span {
		font-size: ${(p) => p.theme.fontSize.s}px;
	}
`

const Input = styled.input`
	border: none;
	border-radius: ${(p) => p.theme.space.xs}px;
	padding: ${(p) => p.theme.space.m}px ${(p) => p.theme.space.xxl}px ${(p) => p.theme.space.m}px
		${(p) => p.theme.space.l}px;
	border: 2px solid ${(p) => p.theme.color.willhaben};
	margin-top: 2px;
	height: 44px;
	width: 44px;
	accent-color: ${(p) => p.theme.color.willhaben};
`
