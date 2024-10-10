import React, { useCallback, useEffect, useState } from 'react'
import { FunctionComponent } from 'react'
import { Label, Content } from '../../../pages/controlpanel'
import styled from 'styled-components'
import { FatButton } from './FatButton'
import { AiFillEye } from 'react-icons/ai'
import { HiVolumeOff, HiVolumeUp } from 'react-icons/hi'
import { AiFillNotification } from 'react-icons/ai'
import { FaHeart } from 'react-icons/fa'
import { FaMicrophone } from 'react-icons/fa'
import { SiTarget } from 'react-icons/si'
import {
	CMS_UPDATE,
	DONATION_ALERT_UPDATE,
	DONATION_CHALLENGE_UPDATE,
	DONATION_GOAL_UPDATE,
	DONATION_WIDGET_UPDATE,
	GlobalState,
	REQUEST_CMS_DATA,
	REQUEST_DONATION_TRIGGER,
	SETTINGS_UPDATE,
	SpeakerType,
	STATE_UPDATE,
	TTS_SPEAKER_SELECT_ITEMS,
} from '@cp/common'
import { useSocket } from '../../hooks/useSocket'
import { Range } from 'react-range'
import { IoMdResize } from 'react-icons/io'
import { useDebouncedCallback } from 'use-debounce'
import { FatSelect } from './FatSelect'
import { FatInput } from './FatInput'
import { SocketAuth } from '../../provider/SocketProvider'
import { formatWishSlug, generateRandomDonation } from '../../lib/utils'

export const LeftPanel: FunctionComponent<React.PropsWithChildren<{ globalState: GlobalState; auth: SocketAuth }>> = ({
	globalState,
	auth,
}) => {
	const { socket } = useSocket()
	const [scaleDonationAlert, setScaleDonationALert] = useState([globalState.donationAlert.scale])
	const [scaleDonationWidget, setScaleDonationWidget] = useState([globalState.donationWidget.scale])
	const [scaleDonationChallengeWidget, setScaleDonationChallengeWidget] = useState([
		globalState.donationChallengeWidget.scale,
	])
	const [scaleDonationGoal, setScaleDonationGoal] = useState([globalState.donationGoal.scale])

	const [wishes, setWishes] = useState<{ value: string; label: string }[]>([])
	const [isDisabledWishSelected, setIsDisabledWishSelected] = useState(false)

	const [isMounted, setIsMounted] = useState(false)
	useEffect(() => {
		setIsMounted(true)
	}, [])

	const emitVolumeUpdate = useCallback(() => {
		const newVolume = getNewVolumeFromClick(globalState.settings.volume)
		socket?.emit(SETTINGS_UPDATE, {
			volume: newVolume,
		})
	}, [globalState.settings.volume, socket])

	const emitLanguageUpdate = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			socket?.emit(SETTINGS_UPDATE, {
				text2speech: {
					...globalState.settings.text2speech,
					language: e.currentTarget.value as SpeakerType,
				},
			})
		},
		[globalState.settings.text2speech, socket]
	)

	const emitWishUpdate = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			socket?.emit(DONATION_WIDGET_UPDATE, {
				wish: {
					slug: e.currentTarget.value,
				},
			})
			setIsDisabledWishSelected(true)
			const timer = setTimeout(() => {
				setIsDisabledWishSelected(false)
				clearTimeout(timer)
			}, 10000)
			return () => clearTimeout(timer)
		},
		[socket]
	)

	const emitMinDonationAmountUpdate = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const numberRegex = /^[0-9\b]+$/
			if (e.target.value === '' || numberRegex.test(e.target.value)) {
				socket?.emit(SETTINGS_UPDATE, {
					text2speech: {
						...globalState.settings.text2speech,
						minDonationAmount: Number(e.currentTarget.value),
					},
				})
			}
		},
		[globalState.settings.text2speech, socket]
	)

	const emitDonationGoalAmountUpdate = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const numberRegex = /^[0-9\b]+$/
			if (e.target.value === '' || numberRegex.test(e.target.value)) {
				socket?.emit(DONATION_GOAL_UPDATE, {
					...globalState.donationGoal,
					data: {
						...globalState.donationGoal.data,
						goal: Number(e.target.value),
					},
				})
			}
		},
		[globalState.donationGoal, socket]
	)

	const emitText2SpeechVolume = useCallback(() => {
		const newVolume = getNewVolumeFromClick(globalState.settings.text2speech.volume)
		socket?.emit(SETTINGS_UPDATE, {
			text2speech: {
				...globalState.settings.text2speech,
				volume: newVolume,
			},
		})
	}, [globalState.settings.text2speech, socket])

	const emitDonationGoalVisibleUpdate = useCallback(() => {
		socket?.emit(DONATION_GOAL_UPDATE, {
			isVisible: !globalState.donationGoal.isVisible,
		})
	}, [globalState.donationGoal.isVisible, socket])

	const emitDonationAlertVisibleUpdate = useCallback(() => {
		socket?.emit(DONATION_ALERT_UPDATE, {
			isVisible: !globalState.donationAlert.isVisible,
		})
	}, [globalState.donationAlert.isVisible, socket])

	const emitDonationScaleChange = useDebouncedCallback((scale: number) => {
		socket?.emit(DONATION_ALERT_UPDATE, {
			scale,
		})
	}, 125)
	const emitDonationWidgetScaleChange = useDebouncedCallback((scale: number) => {
		socket?.emit(DONATION_WIDGET_UPDATE, {
			scale,
		})
	}, 125)

	const emitDonationChallengeWidgetScaleChange = useDebouncedCallback((scale: number) => {
		socket?.emit(DONATION_CHALLENGE_UPDATE, {
			scale,
		})
	}, 125)

	const emitDonationGoalScaleChange = useDebouncedCallback((scale: number) => {
		socket?.emit(DONATION_GOAL_UPDATE, {
			scale,
		})
	}, 125)

	const emitDonationWidgetVisibleUpdate = useCallback(() => {
		socket?.emit(DONATION_WIDGET_UPDATE, {
			isVisible: !globalState.donationWidget.isVisible,
		})
	}, [globalState.donationWidget.isVisible, socket])

	useEffect(() => {
		emitDonationScaleChange(scaleDonationAlert[0])
	}, [emitDonationScaleChange, scaleDonationAlert])

	useEffect(() => {
		emitDonationWidgetScaleChange(scaleDonationWidget[0])
	}, [emitDonationWidgetScaleChange, scaleDonationWidget])

	useEffect(() => {
		emitDonationChallengeWidgetScaleChange(scaleDonationChallengeWidget[0])
	}, [emitDonationChallengeWidgetScaleChange, scaleDonationChallengeWidget])

	useEffect(() => {
		emitDonationGoalScaleChange(scaleDonationGoal[0])
	}, [emitDonationGoalScaleChange, scaleDonationGoal])

	const emitRandomDonation = useCallback(
		(donationAmount?: number) => {
			socket?.emit(REQUEST_DONATION_TRIGGER, generateRandomDonation(auth.channel, donationAmount))
		},
		[socket, auth.channel]
	)

	useEffect(() => {
		socket?.on(CMS_UPDATE, (cmsSlugs) => {
			const wishSelectableItems = []
			if (cmsSlugs.length > 0) {
				for (const slug of cmsSlugs) {
					wishSelectableItems.push({ label: formatWishSlug(slug), value: slug })
				}
			} else {
				wishSelectableItems.push({ label: 'Keine Wünsche zugewiesen', value: '' })
			}
			setWishes(wishSelectableItems)
		})
	}, [socket, auth.channel])

	/**
	 * Initially set the donationwidget slug from frontend
	 * when mawdata is available
	 */
	useEffect(() => {
		socket?.on(STATE_UPDATE, (stateUpdate: GlobalState) => {
			if (stateUpdate.donationWidget.wish?.slug === 'noslug' && wishes.length > 0) {
				socket.emit(DONATION_WIDGET_UPDATE, {
					wish: {
						slug: wishes[0].value,
					},
				})
			}
		})
	}, [socket, auth.channel, wishes])

	useEffect(() => {
		socket?.emit(REQUEST_CMS_DATA)
	}, [socket, isMounted])

	return (
		<GridLeftPanel>
			<Label
				style={{
					display: 'flex',
					justifyContent: 'space-between',
				}}
			>
				<span style={{ display: 'flex' }}>
					<IconWrapper>
						<AiFillNotification size="14px" style={{ marginRight: '6px' }} />
					</IconWrapper>
					Donation Alert
				</span>
				<DemoAlertButton onClick={() => emitRandomDonation()}>Demo</DemoAlertButton>
			</Label>
			<Content>
				<ButtonsWrapper>
					<DoubleCol>
						<FatButton
							icon={<AiFillEye size="24px" />}
							active={globalState.donationAlert.isVisible}
							value={globalState?.donationAlert.isVisible === true ? 'true' : 'false'}
							onClick={emitDonationAlertVisibleUpdate}
						/>
						<FatButton
							icon={globalState.settings.volume > 0 ? <HiVolumeUp size="24px" /> : <HiVolumeOff size="24px" />}
							active={globalState.settings.volume > 0}
							value={globalState?.settings.volume.toString()}
							onClick={emitVolumeUpdate}
						>
							<VolumeIndicator volume={globalState.settings.volume} />
						</FatButton>
					</DoubleCol>

					<Range
						values={scaleDonationAlert}
						step={0.01}
						min={0.15}
						max={2}
						onChange={(values) => setScaleDonationALert(values)}
						renderTrack={({ props, children }) => (
							<div
								role="button"
								tabIndex={-1}
								/* eslint-disable react/prop-types */
								onMouseDown={props.onMouseDown}
								onTouchStart={props.onTouchStart}
								style={{
									...props.style,
									height: '40px',
									display: 'flex',
									width: '100%',
									marginBottom: '8px',
								}}
							>
								<div
									ref={props.ref}
									style={{
										height: '5px',
										width: '100%',
										borderRadius: '2px',
										alignSelf: 'center',
										backgroundColor: 'rgba(255,255,255,0.2)',
									}}
								>
									{children}
								</div>
							</div>
						)}
						renderThumb={({ props }) => (
							<div
								{...props}
								style={{
									/* eslint-disable react/prop-types */
									...props.style,
									height: '28px',
									width: '28px',
									borderRadius: '4px',
									backgroundColor: '#049EE7',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<SizeIconWrapper>
									<IoMdResize size={24} />
								</SizeIconWrapper>
							</div>
						)}
					/>

					{/* -------- */}

					<Label
						style={{
							margin: '0 -8px',
							marginBottom: '8px',
							display: 'flex',
							justifyContent: 'space-between',
						}}
					>
						<span style={{ display: 'flex' }}>
							<IconWrapper>
								<SiTarget size="14px" style={{ marginRight: '6px' }} />
							</IconWrapper>
							Personal Goal
						</span>
					</Label>

					<DoubleCol>
						<FatButton
							icon={<AiFillEye size="24px" />}
							active={globalState.donationGoal.isVisible}
							value={globalState?.donationGoal.isVisible === true ? 'true' : 'false'}
							onClick={emitDonationGoalVisibleUpdate}
						/>

						<FatInput
							name="personalDonationGoal"
							label=""
							placeholder="12345"
							value={globalState.donationGoal.data.goal}
							onChange={emitDonationGoalAmountUpdate}
						/>
					</DoubleCol>
					<Range
						values={scaleDonationGoal}
						step={0.01}
						min={0.15}
						max={2}
						onChange={(values) => setScaleDonationGoal(values)}
						renderTrack={({ props, children }) => (
							<div
								role="button"
								tabIndex={-1}
								/* eslint-disable react/prop-types */
								onMouseDown={props.onMouseDown}
								onTouchStart={props.onTouchStart}
								style={{
									...props.style,
									height: '40px',
									display: 'flex',
									width: '100%',
									marginBottom: '8px',
								}}
							>
								<div
									ref={props.ref}
									style={{
										height: '5px',
										width: '100%',
										borderRadius: '2px',
										alignSelf: 'center',
										backgroundColor: 'rgba(255,255,255,0.2)',
									}}
								>
									{children}
								</div>
							</div>
						)}
						renderThumb={({ props }) => (
							<div
								{...props}
								style={{
									/* eslint-disable react/prop-types */
									...props.style,
									height: '28px',
									width: '28px',
									borderRadius: '4px',
									backgroundColor: '#049EE7',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<SizeIconWrapper>
									<IoMdResize size={24} />
								</SizeIconWrapper>
							</div>
						)}
					/>

					{/* -------- */}

					<Label
						style={{
							margin: '0 -8px',
							marginBottom: '8px',
							display: 'flex',
							justifyContent: 'space-between',
						}}
					>
						<span style={{ display: 'flex' }}>
							<IconWrapper>
								<FaMicrophone size="14px" style={{ marginRight: '6px' }} />
							</IconWrapper>
							Text-2-Speech
						</span>
						<DemoAlertButton onClick={() => emitRandomDonation(globalState.settings.text2speech.minDonationAmount)}>
							Demo
						</DemoAlertButton>
					</Label>
					<DoubleCol>
						<FatButton
							icon={
								globalState.settings.text2speech.volume > 0 ? <HiVolumeUp size="24px" /> : <HiVolumeOff size="24px" />
							}
							active={globalState.settings.text2speech.volume > 0}
							value={globalState.settings.text2speech.volume.toString()}
							onClick={emitText2SpeechVolume}
						>
							<VolumeIndicator volume={globalState.settings.text2speech.volume} />
						</FatButton>
						<FatInput
							name="minDonationAmountForText2Speech"
							value={globalState.settings.text2speech.minDonationAmount}
							onChange={emitMinDonationAmountUpdate}
						/>
					</DoubleCol>
					<FatSelect
						onChange={emitLanguageUpdate}
						items={TTS_SPEAKER_SELECT_ITEMS}
						value={globalState.settings.text2speech.language}
					/>

					<Label
						style={{
							margin: '0 -8px',
							marginBottom: '8px',
							display: 'flex',
							justifyContent: 'space-between',
						}}
					>
						<span style={{ display: 'flex' }}>
							<IconWrapper>
								<FaHeart size="14px" style={{ marginRight: '6px' }} />
							</IconWrapper>
							Wishes
						</span>
						<StyledLink target="_blank" href={`${process.env.NEXT_PUBLIC_MAW_DASHBOARD_BASE_URL}${auth.channel}`}>
							Zum Dashboard
						</StyledLink>
					</Label>

					<FatButton
						icon={<AiFillEye size="24px" />}
						active={globalState.donationWidget.isVisible}
						value={globalState?.donationWidget.isVisible === true ? 'true' : 'false'}
						onClick={emitDonationWidgetVisibleUpdate}
					/>

					<Range
						values={scaleDonationWidget}
						step={0.01}
						min={0.15}
						max={2}
						onChange={(values) => setScaleDonationWidget(values)}
						renderTrack={({ props, children }) => (
							<div
								role="button"
								tabIndex={-1}
								/* eslint-disable react/prop-types */
								onMouseDown={props.onMouseDown}
								onTouchStart={props.onTouchStart}
								style={{
									...props.style,
									height: '40px',
									display: 'flex',
									width: '100%',
								}}
							>
								<div
									ref={props.ref}
									style={{
										height: '5px',
										width: '100%',
										borderRadius: '2px',
										alignSelf: 'center',
										backgroundColor: 'rgba(255,255,255,0.2)',
									}}
								>
									{children}
								</div>
							</div>
						)}
						renderThumb={({ props }) => (
							<div
								{...props}
								style={{
									/* eslint-disable react/prop-types */
									...props.style,
									height: '28px',
									width: '28px',
									borderRadius: '4px',
									backgroundColor: '#049EE7',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<SizeIconWrapper>
									<IoMdResize size={24} />
								</SizeIconWrapper>
							</div>
						)}
					/>

					<FatSelect
						id="wishes"
						onChange={emitWishUpdate}
						items={wishes}
						value={globalState.donationWidget.wish ? globalState.donationWidget.wish.slug : ''}
						disabled={isDisabledWishSelected}
					/>

					{/* -------- */}

					<Label
						style={{
							margin: '0 -8px',
							marginBottom: '8px',
							display: 'flex',
							justifyContent: 'space-between',
						}}
					>
						<span style={{ display: 'flex' }}>
							<IconWrapper>
								<FaHeart size="14px" style={{ marginRight: '6px' }} />
							</IconWrapper>
							Donationchallenge
						</span>
					</Label>

					<Range
						values={scaleDonationChallengeWidget}
						step={0.01}
						min={0.15}
						max={2}
						onChange={(values) => setScaleDonationChallengeWidget(values)}
						renderTrack={({ props, children }) => (
							<div
								role="button"
								tabIndex={-1}
								/* eslint-disable react/prop-types */
								onMouseDown={props.onMouseDown}
								onTouchStart={props.onTouchStart}
								style={{
									...props.style,
									height: '40px',
									display: 'flex',
									width: '100%',
								}}
							>
								<div
									ref={props.ref}
									style={{
										height: '5px',
										width: '100%',
										borderRadius: '2px',
										alignSelf: 'center',
										backgroundColor: 'rgba(255,255,255,0.2)',
									}}
								>
									{children}
								</div>
							</div>
						)}
						renderThumb={({ props }) => (
							<div
								{...props}
								style={{
									/* eslint-disable react/prop-types */
									...props.style,
									height: '28px',
									width: '28px',
									borderRadius: '4px',
									backgroundColor: '#049EE7',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<SizeIconWrapper>
									<IoMdResize size={24} />
								</SizeIconWrapper>
							</div>
						)}
					/>
				</ButtonsWrapper>
			</Content>
		</GridLeftPanel>
	)
}

const SizeIconWrapper = styled.span`
	display: flex;
	align-items: center;
	* {
		padding: 2px;
		stroke-width: 12px;
		color: ${(p) => p.theme.color.white};
	}
`

const VolumeIndicator: FunctionComponent<React.PropsWithChildren<{ volume: number }>> = ({ volume }) => {
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

const Circle: FunctionComponent<React.PropsWithChildren<{ filled: boolean; active: boolean }>> = ({
	filled,
	active,
}) => {
	return <VolumeCircle filled={filled} active={active} />
}

const VolumeCircle = styled.div<{ filled: boolean; active: boolean }>`
	height: 10px;
	width: 10px;
	border-radius: 50%;
	background-color: ${(p) => (!p.active ? 'transparent' : p.filled ? 'white' : 'rgba(255, 255, 255, 0.2)')};
	border: 1px solid;
`

const CirclesWrapper = styled.div`
	margin-top: 6px;
	display: flex;

	& > ${VolumeCircle}:not(:last-child) {
		margin-right: ${(p) => p.theme.space.xs}px;
	}
`

const DemoAlertButton = styled.button`
	outline: none;
	background-color: #464649;
	color: ${(p) => p.theme.color.white};
	border: 0;
	font-size: 12px;
	padding: 4px 8px;
	cursor: pointer;
	border-radius: 2px;
`

const ButtonsWrapper = styled.div`
	& > button:not(:last-child) {
		margin-bottom: ${(p) => p.theme.space.s}px;
	}
`

const StyledLink = styled.a`
	font-size: ${(p) => p.theme.fontSize.s}px;
`

const IconWrapper = styled.span`
	display: flex;
	align-items: center;
	* {
		color: ${(p) => p.theme.color.charityGold};
	}
`

export const GridLeftPanel = styled.div`
	grid-area: left-panel;
`

const DoubleCol = styled.div`
	display: flex;
	gap: ${(p) => p.theme.space.s}px;
	margin-bottom: ${(p) => p.theme.space.s}px;
	height: 64px;
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));

	& > * {
		height: 100%;
	}
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
