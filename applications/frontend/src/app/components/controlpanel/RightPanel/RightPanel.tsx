import React from 'react'
import { FunctionComponent } from 'react'
import { Label, Content } from '../../../../pages/controlpanel'
import { styled } from '../../../styles/Theme'
import { GrMoney } from 'react-icons/gr'
import { Donation } from '@pftp/common'
import { Donations } from './DonationList'

export const RightPanel: FunctionComponent = () => {
	const donations: Donation[] = [
		{
			user: 'heideltrautEUW',
			amount: 50.2,
			timestamp: new Date().toDateString(),
		},
		{
			user: 'heideltrautEUW',
			amount: 50.2,
			timestamp: new Date().toDateString(),
		},
		{
			user: 'heideltrautEUW',
			amount: 50.2,
			timestamp: new Date().toDateString(),
		},
		{
			user: 'heideltrautEUW',
			amount: 50.2,
			timestamp: new Date().toDateString(),
		},
		{
			user: 'heideltrautEUW',
			amount: 50.2,
			timestamp: new Date().toDateString(),
		},
		{
			user: 'heideltrautEUW',
			amount: 50.2,
			timestamp: new Date().toDateString(),
		},
		{
			user: 'heideltrautEUW',
			amount: 50.2,
			timestamp: new Date().toDateString(),
		},
	]
	return (
		<GridRightPanel>
			<Label>
				<IconWrapper>
					<GrMoney size="14px" style={{ marginRight: '6px' }} />
				</IconWrapper>
				Recent Donations
			</Label>
			<Content>
				<Donations donations={donations} />
			</Content>
		</GridRightPanel>
	)
}

const IconWrapper = styled.span`
	display: flex;
	align-items: center;
	* {
		stroke: ${(p) => p.theme.color.piggyPink};
	}
`

const GridRightPanel = styled.div`
	background-color: ${(p) => p.theme.color.background};
	grid-area: right-panel;
`
