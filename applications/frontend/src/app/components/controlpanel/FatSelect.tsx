import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { RiArrowDropDownLine } from 'react-icons/ri/index'
import { CgSpinnerTwoAlt } from 'react-icons/cg'

interface FatSelectProps extends React.HTMLAttributes<HTMLSelectElement> {
	value: string
	disabled?: boolean
	items: { value: string; label: string }[]
}

export const FatSelect: FunctionComponent<React.PropsWithChildren<FatSelectProps>> = ({
	items,
	value,
	disabled,
	...props
}: FatSelectProps) => {
	return (
		<SelectWrapper>
			<Select {...props} value={value} disabled={disabled}>
				{items.map((items, i) => {
					return (
						<option key={`${items}-${i}`} value={items.value}>
							{items.label}
						</option>
					)
				})}
			</Select>
			{disabled ? (
				<IconWrapper>
					<CgSpinnerTwoAlt
						size={12}
						style={{
							position: 'absolute',
							animation: 'rotate .85s linear infinite',
							top: '50%',
							right: 6,
							transform: 'translateY(-50%)',
						}}
					></CgSpinnerTwoAlt>
				</IconWrapper>
			) : (
				<RiArrowDropDownLine
					size={32}
					style={{
						position: 'absolute',
						top: '50%',
						right: 0,
						transform: 'translateY(-50%)',
					}}
				/>
			)}
		</SelectWrapper>
	)
}

const IconWrapper = styled.div`
	path {
		fill: ${(p) => p.theme.color.charityGold};
	}
`

const SelectWrapper = styled.div`
	position: relative;
	margin-bottom: ${(p) => p.theme.space.s}px;
`

const Select = styled.select`
	border: none;
	border-radius: ${(p) => p.theme.space.xs}px;
	background-color: rgba(255, 255, 255, 0.2);
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	padding: ${(p) => p.theme.space.m}px ${(p) => p.theme.space.xxl}px ${(p) => p.theme.space.m}px
		${(p) => p.theme.space.l}px;
	width: 100%;
	appearance: none;

	option {
		background-color: #464649;
	}
`
