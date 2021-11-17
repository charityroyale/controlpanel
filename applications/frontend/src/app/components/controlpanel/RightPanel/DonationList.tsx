import { Donation } from '@pftp/common'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { FaCoins } from 'react-icons/fa'
import { formatCurrency, formatTimeStamp } from '../../../lib/utils'

export const Donations: FunctionComponent<{ donations: Donation[] }> = ({ donations }) => {
	return (
		<DonationList>
			{donations.map((donation, i) => {
				return (
					<DonationItem key={donation.user + i}>
						<DonationHeader>
							<DonationUserWithIcon>
								<IconWrapper>
									<FaCoins style={{ paddingRight: '4px' }} size="18px" />
								</IconWrapper>
								{donation.user}
							</DonationUserWithIcon>
						</DonationHeader>
						<DonationBottom>
							<DonationDate>{formatTimeStamp(donation.timestamp)}</DonationDate>
							<DonationAmount highlight={donation.amount >= 50}>{formatCurrency(donation.amount)}</DonationAmount>
						</DonationBottom>
					</DonationItem>
				)
			})}
		</DonationList>
	)
}

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

const DonationHeader = styled.div`
	display: flex;
	justify-content: space-between;
`

const DonationUserWithIcon = styled.div`
	display: flex;
	align-items: center;
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
	justify-content: space-between;
`

const IconWrapper = styled.span`
	display: flex;
	align-items: center;
	* {
		color: ${(p) => p.theme.color.charityGold};
	}
`
