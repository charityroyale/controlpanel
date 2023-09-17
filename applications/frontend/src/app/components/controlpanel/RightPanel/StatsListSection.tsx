import React, { FunctionComponent } from 'react'
import { HiChartBar } from 'react-icons/hi'
import { Content, Label } from '../../../../pages/controlpanel'
import { IconWrapper } from './DonationListSection'
import styled from 'styled-components'
import { AiFillInstagram } from 'react-icons/ai'
import { RiTwitterXFill } from 'react-icons/ri'
import { SocketAuth } from '../../../provider/SocketProvider'

interface StatsListSectionProps {
	auth: SocketAuth
}

export const StatsListSection: FunctionComponent<StatsListSectionProps> = ({ auth }) => {
	return (
		<React.Fragment>
			<Label>
				<IconWrapper>
					<HiChartBar size="14px" style={{ marginRight: '6px' }} />
				</IconWrapper>
				My STATS
			</Label>
			<Content>
				<StatsReport>
					<StatsItem>
						<div>
							<StatsItemTitle>Total report</StatsItemTitle>
							<StatsItemSubTitle>Share your total stats</StatsItemSubTitle>
						</div>

						<StatsItemLinkWrapper>
							<a href={`https://stats.hammertime.studio/${auth.channel}/instagram`} target="_blank" rel="noreferrer">
								<ReportLinkWrapper>
									<AiFillInstagram size="24px" />
								</ReportLinkWrapper>
							</a>
							<a href={`https://stats.hammertime.studio/${auth.channel}/twitter`} target="_blank" rel="noreferrer">
								<ReportLinkWrapper>
									<RiTwitterXFill size="24px" />
								</ReportLinkWrapper>
							</a>
						</StatsItemLinkWrapper>
					</StatsItem>
				</StatsReport>
			</Content>
		</React.Fragment>
	)
}

const StatsItemTitle = styled.div`
	font-size: ${(p) => p.theme.fontSize.m}px;
	color: ${(p) => p.theme.color.charityGold};
`
const StatsItemSubTitle = styled.div`
	font-size: ${(p) => p.theme.fontSize.m}px;
	color: #7c7c7c;
`
const ReportLinkWrapper = styled.div`
	display: flex;
	align-items: center;
	* {
		stroke: ${(p) => p.theme.color.willhaben};
		color: ${(p) => p.theme.color.willhaben};
	}
`

const StatsItem = styled.div`
	display: flex;
	justify-content: space-between;
`

const StatsItemLinkWrapper = styled.div`
	display: flex;
	gap: 4px;
`

const StatsReport = styled.div`
	& > div:not(:last-child) {
		border-bottom: 1px solid ${(p) => p.theme.color.slightlyTransparent};
		margin-bottom: ${(p) => p.theme.space.s}px;
	}
`
