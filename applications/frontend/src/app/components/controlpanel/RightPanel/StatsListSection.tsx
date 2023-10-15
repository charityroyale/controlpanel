import React, { FunctionComponent, useEffect, useState } from 'react'
import { HiChartBar } from 'react-icons/hi'
import { Content, Label } from '../../../../pages/controlpanel'
import { IconWrapper } from './DonationListSection'
import styled from 'styled-components'
import { AiFillInstagram } from 'react-icons/ai'
import { RiTwitterXFill } from 'react-icons/ri'
import { SocketAuth } from '../../../provider/SocketProvider'
import { CMS_UPDATE } from '@cp/common'
import { useSocket } from '../../../hooks/useSocket'
import { formatWishSlugStats } from '../../../lib/utils'

interface StatsListSectionProps {
	auth: SocketAuth
}

export const StatsListSection: FunctionComponent<StatsListSectionProps> = ({ auth }) => {
	const { socket } = useSocket()
	const [wishes, setWishes] = useState<{ value: string; label: string }[]>([])

	useEffect(() => {
		socket?.on(CMS_UPDATE, (cmsSlugs) => {
			const wishSelectableItems = []
			if (cmsSlugs.length > 0) {
				for (const slug of cmsSlugs) {
					wishSelectableItems.push({ label: formatWishSlugStats(slug), value: slug })
				}
			} else {
				wishSelectableItems.push({ label: 'Keine Wünsche zugewiesen', value: '' })
			}
			setWishes(wishSelectableItems)
		})
	}, [socket, auth.channel])

	return (
		<React.Fragment>
			<Label>
				<IconWrapper>
					<HiChartBar size="14px" style={{ marginRight: '6px' }} />
				</IconWrapper>
				STATS
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

					{wishes.map((wish) => {
						return (
							<StatsItem key={wish.value}>
								<div>
									<StatsItemTitle>{wish.label}</StatsItemTitle>
									<StatsItemSubTitle>Stats for {wish.label}</StatsItemSubTitle>
								</div>

								<StatsItemLinkWrapper>
									<a
										href={`https://stats.hammertime.studio/${auth.channel}/instagram?wish=${wish.value}`}
										target="_blank"
										rel="noreferrer"
									>
										<ReportLinkWrapper>
											<AiFillInstagram size="24px" />
										</ReportLinkWrapper>
									</a>
									<a
										href={`https://stats.hammertime.studio/${auth.channel}/twitter?wish=${wish.value}`}
										target="_blank"
										rel="noreferrer"
									>
										<ReportLinkWrapper>
											<RiTwitterXFill size="24px" />
										</ReportLinkWrapper>
									</a>
								</StatsItemLinkWrapper>
							</StatsItem>
						)
					})}
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
