import React, { useCallback, useEffect, useState } from 'react'
import { FunctionComponent } from 'react'
import { Label, Content } from '../../../pages/controlpanel'
import styled from 'styled-components'
import { FatButton } from './FatButton'
import { AiFillEye } from 'react-icons/ai/index'
import { HiVolumeOff, HiVolumeUp } from 'react-icons/hi'
import { AiFillNotification } from 'react-icons/ai'
import {
	Donation,
	DONATION_ALERT_UPDATE,
	DONATION_TRIGGER,
	DONATION_WIDGET_UPDATE,
	GlobalState,
	MakeAWishInfoJsonDTO,
	MAW_INFO_JSON_DATA_UPDATE,
	SETTINGS_UPDATE,
} from '@pftp/common'
import { useSocket } from '../../hooks/useSocket'
import { Range } from 'react-range'
import { IoMdResize } from 'react-icons/io'
import { useDebouncedCallback } from 'use-debounce'
import { FatSelect } from './FatSelect'
import { FatInput } from './FatInput'

export const LeftPanel: FunctionComponent<{ globalState: GlobalState }> = ({ globalState }) => {
	const { socket } = useSocket()
	const [scaleDonationAlert, setScaleDonationALert] = useState([globalState.donationAlert.scale])
	const [scaleDonationWidget, setScaleDonationWidget] = useState([globalState.donationWidget.scale])
	const [languages, setLanguages] = useState<{ value: string; label: string }[]>([])
	const [wishes, setWishes] = useState<{ value: string; label: string }[]>([])

	const emitVolumeUpdate = useCallback(() => {
		const newVolume = getNewVolumeFromClick(globalState.settings.volume)
		socket?.emit(SETTINGS_UPDATE, {
			volume: newVolume,
		})
	}, [globalState.settings.volume, socket])

	const emitLanguageUpdate = useCallback(
		(e) => {
			socket?.emit(SETTINGS_UPDATE, {
				text2speech: {
					...globalState.settings.text2speech,
					language: e.currentTarget.value,
				},
			})
		},
		[globalState.settings.text2speech, socket]
	)

	const emitWishUpdate = useCallback(
		(e) => {
			socket?.emit(DONATION_WIDGET_UPDATE, {
				wish: {
					slug: e.currentTarget.value,
				},
			})
		},
		[socket]
	)

	const emitMinDonationAmountUpdate = useCallback(
		(e) => {
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

	const emitText2SpeechVolume = useCallback(() => {
		const newVolume = getNewVolumeFromClick(globalState.settings.text2speech.volume)
		socket?.emit(SETTINGS_UPDATE, {
			text2speech: {
				...globalState.settings.text2speech,
				volume: newVolume,
			},
		})
	}, [globalState.settings.text2speech, socket])

	const emitDonationScaleChange = useDebouncedCallback((scale: number) => {
		socket?.emit(DONATION_ALERT_UPDATE, {
			scale,
		})
	}, 125)

	const emitDonationAlertVisibleUpdate = useCallback(() => {
		socket?.emit(DONATION_ALERT_UPDATE, {
			isVisible: !globalState.donationAlert.isVisible,
		})
	}, [globalState.donationAlert.isVisible, socket])

	const emitDonationWidgetScaleChange = useDebouncedCallback((scale: number) => {
		socket?.emit(DONATION_WIDGET_UPDATE, {
			scale,
		})
	}, 125)

	const emitDonatioNWidgetVisibleUpdate = useCallback(() => {
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

	const emitRandomDonation = useCallback(() => {
		const precision = 2
		const maxAmount = 1250
		const randomnum =
			Math.floor(Math.random() * (maxAmount * precision - 1 * precision) + 1 * precision) / (1 * precision)

		const a = ['TestUserA_', 'TestUserB_', 'TestUserC_']
		const b = ['Lasagne', 'StrawBerry', 'Spaghetti']

		const rA = Math.floor(Math.random() * a.length)
		const rB = Math.floor(Math.random() * b.length)
		const name = a[rA] + b[rB]

		const testMessages = [
			'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
			'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy ei',
			'I love you <3!',
			'Lorem ipsum dolor sit amet, consetetur sadipscingddd elitr, sed diam nonumy ei Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy ei',
		]
		const message = testMessages[Math.floor(Math.random() * testMessages.length)]

		const donation: Donation = {
			user: name,
			amount: randomnum,
			timestamp: new Date().getUTCMilliseconds(),
			streamer: '',
			message,
		}

		socket?.emit(DONATION_TRIGGER, donation)
	}, [socket])

	useEffect(() => {
		window.speechSynthesis.onvoiceschanged = () => {
			const voices = window.speechSynthesis.getVoices()
			const languages = voices.map((voice) => {
				return {
					label: voice.name,
					value: voice.lang,
				}
			})
			setLanguages(languages)
		}
	}, [])

	useEffect(() => {
		socket?.on(MAW_INFO_JSON_DATA_UPDATE, (mawInfoJsonData: MakeAWishInfoJsonDTO) => {
			// TODO: replace 'veni' with current streamer
			const wishItems = mawInfoJsonData.streamers['veni'].wishes
			const wishSlectableItems = []
			if (!Array.isArray(wishItems)) {
				for (const key of Object.keys(wishItems)) {
					wishSlectableItems.push({ label: wishItems[key].slug, value: wishItems[key].slug })
				}
			}
			setWishes(wishSlectableItems)
		})
	}, [socket])

	return (
		<GridLeftPanel>
			<Content>
				<ButtonsWrapper>
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
								<AiFillNotification size="14px" style={{ marginRight: '6px' }} />
							</IconWrapper>
							Donation Alert
						</span>
						<DemoAlertButton onClick={emitRandomDonation}>Demo</DemoAlertButton>
					</Label>
					<FatButton
						icon={<AiFillEye size="24px" />}
						active={globalState.donationAlert.isVisible}
						value={globalState?.donationAlert.isVisible === true ? 'true' : 'false'}
						onClick={emitDonationAlertVisibleUpdate}
					>
						<span>Donation Alert</span>
					</FatButton>
					<FatButton
						icon={globalState.settings.volume > 0 ? <HiVolumeUp size="24px" /> : <HiVolumeOff size="24px" />}
						active={globalState.settings.volume > 0}
						value={globalState?.settings.volume.toString()}
						onClick={emitVolumeUpdate}
					>
						<VolumeIndicator volume={globalState.settings.volume} />
					</FatButton>
					<FatButton style={{ cursor: 'default' }}>
						<React.Fragment>
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
						</React.Fragment>
					</FatButton>

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
								<AiFillNotification size="14px" style={{ marginRight: '6px' }} />
							</IconWrapper>
							Text-2-Speech
						</span>
					</Label>
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
					></FatInput>
					<FatSelect
						onBlur={emitLanguageUpdate}
						onChange={emitLanguageUpdate}
						items={languages}
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
								<AiFillNotification size="14px" style={{ marginRight: '6px' }} />
							</IconWrapper>
							MAW Kids
						</span>
					</Label>
					<FatButton
						icon={<AiFillEye size="24px" />}
						active={globalState.donationWidget.isVisible}
						value={globalState?.donationWidget.isVisible === true ? 'true' : 'false'}
						onClick={emitDonatioNWidgetVisibleUpdate}
					>
						<span>Donation Widget</span>
					</FatButton>
					<FatButton style={{ cursor: 'default' }}>
						<React.Fragment>
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
						</React.Fragment>
					</FatButton>
					<FatSelect
						id="wishes"
						onBlur={emitWishUpdate}
						onChange={emitWishUpdate}
						items={wishes}
						value={globalState.donationWidget.wish ? globalState.donationWidget.wish.slug : ''}
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
