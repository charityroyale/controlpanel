import React, { useCallback } from 'react'
import { FunctionComponent } from 'react'
import { Label, Content } from '../../../pages/controlpanel'
import styled from 'styled-components'
import { RiListSettingsFill } from 'react-icons/ri'
import { FatButton } from './FatButton'
import { CHARACTER_UPDATE, GlobalState } from '@pftp/common'
import { useSocket } from '../../hooks/useSocket'

const FatButtonBackgroundColor = 'rgba(255, 255, 255, 0.2)'
export const BottomPanel: FunctionComponent<{ globalState: GlobalState }> = ({ globalState }) => {
	const { socket } = useSocket()

	const emitCharacterPosition = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			socket?.emit(CHARACTER_UPDATE, {
				position: getPositionFromPreset(e.currentTarget.value as PositionPresetType),
			})
		},
		[socket]
	)

	const positionPresetButtonsDisabled = !globalState.character.isLocked
	return (
		<GridBottomPanel>
			<Label>
				<IconWrapper>
					<RiListSettingsFill size="16px" style={{ marginRight: '6px' }} />
				</IconWrapper>
				Position Presets
			</Label>
			<Content
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(3, 1fr)',
					gridTemplateRows: 'repeat(3, 50px)',
					gridGap: '12px',
				}}
			>
				<FatButton
					active={positionPresetButtonsDisabled}
					disabled={!positionPresetButtonsDisabled}
					value="top-left"
					onClick={emitCharacterPosition}
					style={{ backgroundColor: FatButtonBackgroundColor }}
				>
					<span>Top-Left</span>
				</FatButton>
				<FatButton
					active={positionPresetButtonsDisabled}
					disabled={!positionPresetButtonsDisabled}
					value="top-center"
					onClick={emitCharacterPosition}
					style={{ backgroundColor: FatButtonBackgroundColor }}
				>
					<span>Top-Center</span>
				</FatButton>
				<FatButton
					active={positionPresetButtonsDisabled}
					disabled={!positionPresetButtonsDisabled}
					value="top-right"
					onClick={emitCharacterPosition}
					style={{ backgroundColor: FatButtonBackgroundColor }}
				>
					<span>Top-Right</span>
				</FatButton>
				<FatButton
					active={positionPresetButtonsDisabled}
					disabled={!positionPresetButtonsDisabled}
					value="center-left"
					onClick={emitCharacterPosition}
					style={{ backgroundColor: FatButtonBackgroundColor }}
				>
					<span>Center-Left</span>
				</FatButton>
				<FatButton
					active={positionPresetButtonsDisabled}
					disabled={!positionPresetButtonsDisabled}
					value="center"
					onClick={emitCharacterPosition}
					style={{ backgroundColor: FatButtonBackgroundColor }}
				>
					<span>Center</span>
				</FatButton>
				<FatButton
					active={positionPresetButtonsDisabled}
					disabled={!positionPresetButtonsDisabled}
					value="center-right"
					onClick={emitCharacterPosition}
					style={{ backgroundColor: FatButtonBackgroundColor }}
				>
					<span>Center-Right</span>
				</FatButton>

				<FatButton
					active={positionPresetButtonsDisabled}
					disabled={!positionPresetButtonsDisabled}
					value="bottom-left"
					onClick={emitCharacterPosition}
					style={{ backgroundColor: FatButtonBackgroundColor }}
				>
					<span>Bottom-Left</span>
				</FatButton>
				<FatButton
					active={positionPresetButtonsDisabled}
					disabled={!positionPresetButtonsDisabled}
					value="bottom-center"
					onClick={emitCharacterPosition}
					style={{ backgroundColor: FatButtonBackgroundColor }}
				>
					<span>Bottom-Center</span>
				</FatButton>
				<FatButton
					active={positionPresetButtonsDisabled}
					disabled={!positionPresetButtonsDisabled}
					value="bottom-right"
					onClick={emitCharacterPosition}
					style={{ backgroundColor: FatButtonBackgroundColor }}
				>
					<span>Bottom-Right</span>
				</FatButton>
			</Content>
		</GridBottomPanel>
	)
}

const IconWrapper = styled.span`
	display: flex;
	align-items: center;
	* {
		color: ${(p) => p.theme.color.charityGold};
	}
`

type PositionPresetType =
	| 'top-left'
	| 'top-center'
	| 'top-right'
	| 'center-left'
	| 'center'
	| 'center-right'
	| 'bottom-left'
	| 'bottom-center'
	| 'bottom-right'

const padding = 200
const width = 1920
const height = 1080
const centerX = width / 2
const centerY = height / 2
const getPositionFromPreset = (preset: PositionPresetType) => {
	switch (preset) {
		case 'top-left': {
			return { x: padding, y: padding }
		}
		case 'top-center': {
			return { x: centerX, y: padding }
		}
		case 'top-right': {
			return { x: width - padding, y: padding }
		}
		case 'center-left': {
			return { x: padding, y: centerY }
		}
		case 'center': {
			return { x: centerX, y: centerY }
		}
		case 'center-right': {
			return { x: width - padding, y: centerY }
		}
		case 'bottom-left': {
			return { x: padding, y: height - padding }
		}
		case 'bottom-center': {
			return { x: centerX, y: height - padding }
		}
		case 'bottom-right': {
			return { x: width - padding, y: height - padding }
		}
	}
}

export const GridBottomPanel = styled.div`
	grid-area: bottom-panel;
`
