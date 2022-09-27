import { Donation } from '@cp/common'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { formatCurrency, formatTimeStamp } from '../../../lib/utils'

export const Donations: FunctionComponent<React.PropsWithChildren<{ donations: Donation[] }>> = ({ donations }) => {
	return (
		<DonationList>
			{donations.map((donation, i) => {
				return (
					<DonationItem key={donation.user + i}>
						<DonationHeader>
							<DonationUser>{donation.user}</DonationUser>
							<DonationDate>{formatTimeStamp(donation.timestamp)}</DonationDate>
						</DonationHeader>
						<DonationCenter>{donation.message}</DonationCenter>
						<DonationBottom>
							<DonationAmount highlight={donation.amount_net >= 50}>
								{formatCurrency(donation.amount_net)}
							</DonationAmount>
						</DonationBottom>
					</DonationItem>
				)
			})}
		</DonationList>
	)
}

const DonationUser = styled.span`
	max-width: 200px;
	overflow: hidden;
	color: ${(p) => p.theme.color.charityGold};
`

const DonationList = styled.div`
	& > div:not(:last-child) {
		border-bottom: 1px solid ${(p) => p.theme.color.slightlyTransparent};
		margin-bottom: ${(p) => p.theme.space.s}px;
	}
`

const DonationItem = styled.div`
	font-size: ${(p) => p.theme.fontSize.m}px;
	padding-bottom: ${(p) => p.theme.space.s}px;
`

const DonationCenter = styled.div`
	max-width: 200px;
	overflow: hidden;
	display: flex;
`

const DonationHeader = styled.div`
	display: flex;
	padding-bottom: 2px;
	justify-content: space-between;
`

const DonationAmount = styled.div<{ highlight: boolean }>`
	color: ${(p) => (p.highlight ? p.theme.color.charityGold : 'inherit')};
	font-weight: ${(p) => (p.highlight ? 'bold' : 'normal')}; ;
`

const DonationDate = styled.div`
	color: #7c7c7c;
`

const DonationBottom = styled.div`
	display: flex;
	justify-content: flex-end;
	padding-top: 2px;
`
