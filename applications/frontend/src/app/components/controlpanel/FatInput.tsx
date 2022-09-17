import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { FaEuroSign } from 'react-icons/fa/index'

interface FatInputProps extends React.HTMLAttributes<HTMLInputElement> {
	value: string | number
	name: string
	label?: string
}

export const FatInput: FunctionComponent<React.PropsWithChildren<FatInputProps>> = ({
	value,
	name,
	label = 'Minimum Text2Speech amount',
	...props
}: FatInputProps) => {
	return (
		<InputWrapper>
			<FatLabel htmlFor={name}>
				<span>{label}</span>
				<Input {...props} value={value} name={name} id={name}></Input>
			</FatLabel>
			<FaEuroSign
				size={16}
				style={{
					position: 'absolute',
					right: '12px',
					top: '35px',
				}}
			/>
		</InputWrapper>
	)
}

const InputWrapper = styled.div`
	margin-bottom: ${(p) => p.theme.space.s}px;
	position: relative;
`
const FatLabel = styled.label`
	span {
		font-size: ${(p) => p.theme.fontSize.s}px;
	}
`

const Input = styled.input`
	border: none;
	border-radius: ${(p) => p.theme.space.xs}px;
	background-color: rgba(255, 255, 255, 0.2);
	display: flex;
	text-align: right;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	padding: ${(p) => p.theme.space.m}px ${(p) => p.theme.space.xxl}px ${(p) => p.theme.space.m}px
		${(p) => p.theme.space.l}px;
	width: 100%;
	appearance: none;
	border: 2px solid ${(p) => p.theme.color.willhaben};
	box-shadow: 0 0px 16px 0px inset #1f1f23;
	margin-top: 2px;

	option {
		background-color: #464649;
	}
`
