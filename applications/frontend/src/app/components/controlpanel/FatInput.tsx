import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { FaEuroSign } from 'react-icons/fa/index'
import { RxQuestionMarkCircled } from 'react-icons/rx'

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
					<LabelToolTip>
						<RxQuestionMarkCircled></RxQuestionMarkCircled>
					</LabelToolTip>
					<LabelContent>{label}</LabelContent>
				</FatLabel>
			)}

			<div style={{ position: 'relative' }}>
				<FaEuroSign
					size={16}
					style={{
						position: 'absolute',
						right: '12px',
						top: '50%',
						transform: 'translateY(-44%)',
					}}
				/>
				<Input {...props} value={value} name={name} id={name}></Input>
			</div>
		</InputWrapper>
	)
}

const LabelToolTip = styled.div``
const InputWrapper = styled.div`
	position: relative;
	width: 100%;
`

const FatLabel = styled.label`
	z-index: 9999;
	top: 4px;
	left: 4px;
	position: absolute;
	cursor: pointer;

	span {
		font-size: ${(p) => p.theme.fontSize.s}px;
		margin-bottom: 2px;
	}
`
const LabelContent = styled.span`
	display: none;

	${FatLabel}:hover & {
		background-color: ${(p) => p.theme.color.charityGold};
		border-radius: 3px;
		display: flex;
		color: ${(p) => p.theme.color.background};
		padding: ${(p) => p.theme.space.xs}px;
		min-width: 135px;
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
	font-size: 14px;
	padding: ${(p) => p.theme.space.l}px ${(p) => p.theme.space.xxl - 6}px ${(p) => p.theme.space.m}px
		${(p) => p.theme.space.l}px;
	width: 100%;
	appearance: none;
	border: 2px solid ${(p) => p.theme.color.willhaben};
	box-shadow: 0 0px 16px 0px inset #1f1f23;

	option {
		background-color: #464649;
	}
`
