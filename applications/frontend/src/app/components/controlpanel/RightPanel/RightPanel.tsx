import React from 'react'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { DonationListSection } from './DonationListSection'
import { StatsListSection } from './StatsListSection'
import { SocketAuth } from '../../../provider/SocketProvider'

interface RightPanelProps {
	auth: SocketAuth
}

export const RightPanel: FunctionComponent<React.PropsWithChildren<RightPanelProps>> = ({ auth }) => {
	return (
		<GridRightPanel>
			<RightPanelSection>
				<DonationListSection />
			</RightPanelSection>
			<RightPanelSection>
				<StatsListSection auth={auth} />
			</RightPanelSection>
		</GridRightPanel>
	)
}

const RightPanelSection = styled.div`
	height: 50%;
`

const GridRightPanel = styled.div`
	grid-area: right-panel;
	position: relative;
`
