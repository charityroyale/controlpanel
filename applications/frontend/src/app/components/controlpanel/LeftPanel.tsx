import React, { useCallback } from 'react'
import { FunctionComponent } from 'react'
import { Label, Content } from '../../../pages/controlpanel'
import { styled } from '../../styles/Theme'
import { FatButton } from './FatButton'
import { AiFillEye } from 'react-icons/ai/index'
import { HiVolumeOff, HiVolumeUp } from 'react-icons/hi'
import { FaPiggyBank } from 'react-icons/fa'
import { CHARACTER_UPDATE, GlobalState, SETTINGS_UPDATE } from '@pftp/common'
import { useSocket } from '../../hooks/useSocket'

export const LeftPanel: FunctionComponent<{ globalState: GlobalState }> = ({ globalState }) => {
	const { socket } = useSocket()

	const emitCharacterIsVisibleUpdate = useCallback(() => {
		socket?.emit(CHARACTER_UPDATE, {
			isVisible: !globalState.character.isVisible,
		})
	}, [globalState.character.isVisible, socket])

	const emitVolumeUpdate = useCallback(() => {
		const newVolume = getNewVolumeFromClick(globalState.settings.volume)
		socket?.emit(SETTINGS_UPDATE, {
			volume: newVolume,
		})
	}, [globalState.settings.volume, socket])

	return (
		<GridLeftPanel>
			<Label>
				<IconWrapper>
					<FaPiggyBank size="14px" color="#D8B864" style={{ marginRight: '6px' }} />
				</IconWrapper>
				Character
			</Label>
			<Content>
				<ButtonsWrapper>
					<FatButton
						icon={<AiFillEye size="24px" />}
						active={globalState.character.isVisible}
						value={globalState?.character.isVisible === true ? 'true' : 'false'}
						onClick={emitCharacterIsVisibleUpdate}
					>
						<span>Pig Visible</span>
					</FatButton>

					<FatButton
						icon={globalState.settings.volume > 0 ? <HiVolumeUp size="24px" /> : <HiVolumeOff size="24px" />}
						active={globalState.settings.volume > 0}
						value={globalState?.settings.volume.toString()}
						onClick={emitVolumeUpdate}
					>
						<VolumeIndicator volume={globalState.settings.volume} />
					</FatButton>
				</ButtonsWrapper>
			</Content>
		</GridLeftPanel>
	)
}

const VolumeIndicator: FunctionComponent<{ volume: number }> = ({ volume }) => {
	const filledCirclesCount = getStepsFromVolume(volume)
	const notFilledCirclesCount = 5 - filledCirclesCount
	const active = volume > 0

	const filledCircles = []
	for (let i = 0; i < filledCirclesCount; i++) {
		filledCircles.push(<Circle filled={true} key={i} active={active} />)
	}

	const notFilledCircles = []
	for (let i = 0; i < notFilledCirclesCount; i++) {
		notFilledCircles.push(<Circle filled={false} key={i} active={active} />)
	}
	return (
		<CirclesWrapper>
			{filledCircles}
			{notFilledCircles}
		</CirclesWrapper>
	)
}

const Circle: FunctionComponent<{ filled: boolean; active: boolean }> = ({ filled, active }) => {
	return <VolumeCircle filled={filled} active={active} />
}

const VolumeCircle = styled.div<{ filled: boolean; active: boolean }>`
	height: 12px;
	width: 12px;
	border-radius: 50%;
	background-color: ${(p) => (!p.active ? 'transparent' : p.filled ? 'white' : 'rgba(255, 255, 255, 0.2)')};
	border: 1px solid;
`

const CirclesWrapper = styled.div`
	margin-top: 4px;
	display: flex;

	& > ${VolumeCircle}:not(:last-child) {
		margin-right: ${(p) => p.theme.space.xs}px;
	}
`

const ButtonsWrapper = styled.div`
	& > button:not(:last-child) {
		margin-bottom: ${(p) => p.theme.space.s}px;
	}
`

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

const getNewVolumeFromClick = (volume: number) => {
	switch (volume) {
		case 1: {
			return 0
		}
		case 0: {
			return 0.2
		}
		case 0.2: {
			return 0.4
		}
		case 0.4: {
			return 0.6
		}
		case 0.6: {
			return 0.8
		}
		case 0.8: {
			return 1
		}
	}
	return 0
}

const getStepsFromVolume = (volume: number) => {
	switch (volume) {
		case 1: {
			return 5
		}
		case 0: {
			return 0
		}
		case 0.2: {
			return 1
		}
		case 0.4: {
			return 2
		}
		case 0.6: {
			return 3
		}
		case 0.8: {
			return 4
		}
	}
	return 0
}
