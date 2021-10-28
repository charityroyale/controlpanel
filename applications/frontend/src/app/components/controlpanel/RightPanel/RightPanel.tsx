import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FunctionComponent } from 'react'
import { Label, Content } from '../../../../pages/controlpanel'
import { styled } from '../../../styles/Theme'
import { GrMoney } from 'react-icons/gr'
import { Donation, DONATION_TRIGGER } from '@pftp/common'
import { Donations } from './DonationList'
import { useSocket } from '../../../hooks/useSocket'

const maxDonationsToDisplay = 50
export const RightPanel: FunctionComponent = () => {
	const { socket } = useSocket()
	const [donations, setDonations] = useState<Donation[]>([])

	const donationContentRef = useRef<HTMLDivElement | null>(null)
	const donationContentInnerRef = useRef<HTMLDivElement | null>(null)

	const [showScrollTop, setShowScrollTop] = useState(false)
	const [showScrollBottom, setShowScrollBottom] = useState(false)

	useEffect(() => {
		socket?.on(DONATION_TRIGGER, (donation: Donation) => {
			if (donationContentInnerRef.current && donationContentRef.current) {
				const donationContentInnerClientHeight = donationContentInnerRef.current.clientHeight
				const donationContentClientHeight = donationContentRef.current.clientHeight
				if (donationContentInnerClientHeight + 50 > donationContentClientHeight) {
					setShowScrollBottom(true)
				}
			}
			const donationsCopy = donations
			donationsCopy.unshift(donation)

			if (donationsCopy.length > maxDonationsToDisplay) {
				donationsCopy.pop()
			}
			setDonations([...donationsCopy])
		})
		/**
		 * Unfortunately there is no better implementation YET with the missing donations dependency
		 * as it would re-add the socketIO listener exponentially. This is dangerous nevertheless,
		 * as state-changes might get lost.
		 */
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket, setDonations, setShowScrollBottom])

	const onScroll = useCallback(() => {
		if (donationContentRef.current) {
			const { scrollTop, scrollHeight, clientHeight } = donationContentRef.current
			if (scrollTop + clientHeight === scrollHeight) {
				setShowScrollBottom(false)
			} else {
				setShowScrollBottom(true)
			}

			if (scrollTop <= 25) {
				setShowScrollTop(false)
			} else {
				setShowScrollTop(true)
			}
		}
	}, [setShowScrollBottom])

	return (
		<GridRightPanel>
			{showScrollTop && <TopScrollShadow />}
			<Label>
				<IconWrapper>
					<GrMoney size="14px" style={{ marginRight: '6px' }} />
				</IconWrapper>
				Latest 50 donations
			</Label>
			<Content>
				<DonationContent className="custom-scrollbar" onScroll={onScroll} ref={donationContentRef}>
					<div ref={donationContentInnerRef}>
						<Donations donations={donations ?? []} />
					</div>
				</DonationContent>
			</Content>
			{showScrollBottom && <BottomScrollShadow />}
		</GridRightPanel>
	)
}

const TopScrollShadow = styled.div`
	content: '';
	position: absolute;
	top: 30px;
	width: 100%;
	height: 100px;
	z-index: 100;
	background: linear-gradient(#18181b, rgba(255, 255, 255, 0.001));
`

const BottomScrollShadow = styled.div`
	content: '';
	position: absolute;
	bottom: 0;
	width: 100%;
	height: 100px;
	z-index: 100;
	background: linear-gradient(rgba(255, 255, 255, 0.001), #18181b);
`

const DonationContent = styled.div`
	position: relative;
	overflow-y: scroll;
	height: 100%;
	max-height: 300px;
	padding-right: ${(p) => p.theme.space.s}px;

	${(p) => p.theme.media.tablet} {
		max-height: 400px;
	}

	${(p) => p.theme.media.desktop} {
		max-height: unset;
	}
`

const IconWrapper = styled.span`
	display: flex;
	align-items: center;
	* {
		stroke: ${(p) => p.theme.color.charityGold};
	}
`

const GridRightPanel = styled.div`
	background-color: ${(p) => p.theme.color.background};
	grid-area: right-panel;
	position: relative;
`
