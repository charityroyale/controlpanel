import React from 'react'
import { FunctionComponent } from 'react'
import { Label, Content } from '../../../pages/controlpanel'
import { styled } from '../../styles/Theme'
import { FatButton } from './FatButton'
import { AiFillEye } from 'react-icons/ai/index'
import { FaPiggyBank } from 'react-icons/fa'

export const LeftPanel: FunctionComponent = () => {
	return (
		<GridLeftPanel>
			<Label>
				<IconWrapper>
					<FaPiggyBank size="14px" color="#D8B864" style={{ marginRight: '6px' }} />
				</IconWrapper>
				Character
			</Label>
			<Content>
				<FatButton icon={<AiFillEye size="24px" />} active={false}>
					<span>Pig Visible</span>
				</FatButton>
			</Content>
		</GridLeftPanel>
	)
}

const IconWrapper = styled.span`
	display: flex;
	align-items: center;
	* {
		color: #d8b864;
	}
`

export const GridLeftPanel = styled.div`
	background-color: ${(p) => p.theme.color.background};
	grid-area: left-panel;
`
