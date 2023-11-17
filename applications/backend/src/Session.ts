import {
	Donation,
	DONATION_ALERT_UPDATE,
	DONATION_WIDGET_UPDATE,
	GlobalState,
	MAW_INFO_JSON_DATA_UPDATE,
	SocketEventsMap,
	REQUEST_MAW_INFO_JSON_DATA,
	REQUEST_STATE,
	SETTINGS_UPDATE,
	STATE_UPDATE,
	TTS_SPEAKER,
	CMS_UPDATE,
	REQUEST_CMS_DATA,
	DONATION_TRIGGER,
	REQUEST_DONATION_TRIGGER,
	DONATION_GOAL_UPDATE,
} from '@cp/common'
import { configureStore } from '@reduxjs/toolkit'
import { Server, Socket } from 'socket.io'
import {
	donationAlertReducer,
	donationGoalReducer,
	donationWidgetReducer,
	settingsReducer,
	updateDonationAlert,
	updateDonationGoal,
	updateDonationWidget,
	updateSettings,
} from './State'
import { sessionLogger as logger } from './logger'
import { mawApiClient } from './MakeAWishApiClient'
import { createTextToSpeechFile } from './TTS'

export default class Session {
	private readonly store = configureStore<GlobalState>({
		reducer: {
			donationAlert: donationAlertReducer,
			donationWidget: donationWidgetReducer,
			donationGoal: donationGoalReducer,
			settings: settingsReducer,
		},
	})

	constructor(private readonly channel: string, private readonly io: Server<SocketEventsMap>) {
		this.store.subscribe(() => {
			this.io.to(this.channel).emit(STATE_UPDATE, this.store.getState())
			// console.log(this.store.getState())
		})
	}

	public async handleNewReadWriteConnection(socket: Socket<SocketEventsMap, SocketEventsMap>) {
		await this.handleNewReadConnection(socket)
		this.registerWriteHandlers(socket)
	}

	public async handleNewReadConnection(socket: Socket<SocketEventsMap, SocketEventsMap>) {
		await socket.join(this.channel)

		socket.on('disconnect', (reason) => {
			logger.info(`Socket ${socket.id} disconnected with reason: ${reason}`)
		})

		socket.emit(STATE_UPDATE, this.store.getState())
		if (mawApiClient.mawInfoJsonData != null) {
			socket.emit(MAW_INFO_JSON_DATA_UPDATE, mawApiClient.mawInfoJsonData)
		}

		if (mawApiClient.cmsMawWishes != null) {
			for (const upcomingStreamer of mawApiClient.cmsMawWishes) {
				if (upcomingStreamer.streamerChannel.toLocaleLowerCase() === this.channel) {
					const streamerWishes = upcomingStreamer.wishes ?? []
					socket.emit(CMS_UPDATE, streamerWishes)
				}
			}
		}

		this.registerReadHandlers(socket)
	}

	public async triggerDonationAlert(donation: Donation) {
		if (
			donation.message &&
			(donation?.amount_net ?? donation.amount) >= this.store.getState().settings.text2speech.minDonationAmount
		) {
			await createTextToSpeechFile(
				donation.message,
				TTS_SPEAKER[this.store.getState().settings.text2speech.language],
				donation.id
			)
		}

		this.io.to(this.channel).emit(DONATION_TRIGGER, donation)

		if (mawApiClient.mawInfoJsonData) {
			this.io.to(this.channel).emit(MAW_INFO_JSON_DATA_UPDATE, mawApiClient.mawInfoJsonData)
		}
	}

	private registerReadHandlers(socket: Socket<SocketEventsMap, SocketEventsMap>) {
		socket.on(REQUEST_STATE, () => socket.emit(STATE_UPDATE, this.store.getState()))
		socket.on(REQUEST_CMS_DATA, () => {
			if (mawApiClient.cmsMawWishes != null) {
				for (const upcomingStreamer of mawApiClient.cmsMawWishes) {
					if (upcomingStreamer.streamerChannel.toLocaleLowerCase() === this.channel) {
						const streamerWishes = upcomingStreamer.wishes ?? []
						socket.emit(CMS_UPDATE, streamerWishes)
					}
				}
			}
		})
		socket.on(REQUEST_MAW_INFO_JSON_DATA, () => {
			this.store.dispatch(updateDonationWidget({ ...this.store.getState().donationWidget }))

			if (Number(mawApiClient.mawInfoJsonData?.streamers[this.channel]?.current_donation_sum_net)) {
				this.store.dispatch(
					updateDonationGoal({
						...this.store.getState().donationGoal,
						data: {
							...this.store.getState().donationGoal.data,
							current: Number(mawApiClient.mawInfoJsonData?.streamers[this.channel]?.current_donation_sum_net) ?? 0,
						},
					})
				)
			} else {
				logger.warn(
					`Couldn't find streamer data in maw infoJson for channel ${this.channel} to access "current_donation_sum_net".`
				)
			}

			if (mawApiClient.mawInfoJsonData != null) {
				socket.emit(MAW_INFO_JSON_DATA_UPDATE, mawApiClient.mawInfoJsonData)
			}
		})
	}

	private registerWriteHandlers(socket: Socket<SocketEventsMap, SocketEventsMap>) {
		socket.on(DONATION_ALERT_UPDATE, (donationAlertUpdate) =>
			this.store.dispatch(updateDonationAlert(donationAlertUpdate))
		)

		socket.on(DONATION_GOAL_UPDATE, (donationGoalUpdate) => this.store.dispatch(updateDonationGoal(donationGoalUpdate)))

		socket.on(REQUEST_DONATION_TRIGGER, (donation) => {
			this.triggerDonationAlert(donation)
		})

		socket.on(DONATION_WIDGET_UPDATE, (donationWidgetUpdate) => {
			this.store.dispatch(updateDonationWidget(donationWidgetUpdate))
		})
		socket.on(SETTINGS_UPDATE, (settingsUpdate) => this.store.dispatch(updateSettings(settingsUpdate)))
	}
}
