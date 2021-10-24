import { Donation } from '@pftp/common'
import React, { FunctionComponent } from 'react'
import { styled } from '../../../styles/Theme'
import { FaCoins } from 'react-icons/fa'

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
							<DonationDate>{formatDate(new Date(donation.timestamp))}</DonationDate>
							<DonationAmount>{formatCurrency(donation.amount)}</DonationAmount>
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

const DonationAmount = styled.div``

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

const formatDate = (date: Date) => {
	return new Intl.DateTimeFormat('de-AT', { dateStyle: 'short', timeStyle: 'short' }).format(date)
}

const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' }).format(amount)
}
