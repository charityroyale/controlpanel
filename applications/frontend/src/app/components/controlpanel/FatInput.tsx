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
			{label && (
				<FatLabel htmlFor={name}>
					<span>{label}</span>
				</FatLabel>
			)}

			<div style={{ position: 'relative' }}>
				<FaEuroSign
					size={16}
					style={{
						position: 'absolute',
						right: '12px',
						top: '50%',
						transform: 'translateY(-50%)',
					}}
				/>
				<Input {...props} value={value} name={name} id={name}></Input>
			</div>
		</InputWrapper>
	)
}

const InputWrapper = styled.div`
	width: 100%;
`
const FatLabel = styled.label`
	span {
		font-size: ${(p) => p.theme.fontSize.s}px;
		margin-bottom: 2px;
		display: inline-block;
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
	padding: ${(p) => p.theme.space.l}px ${(p) => p.theme.space.xxl}px ${(p) => p.theme.space.m}px
		${(p) => p.theme.space.l}px;
	width: 100%;
	appearance: none;
	border: 2px solid ${(p) => p.theme.color.willhaben};
	box-shadow: 0 0px 16px 0px inset #1f1f23;

	option {
		background-color: #464649;
	}
`
