import {
	Donation,
	DONATION_ALERT_UPDATE,
	DONATION_TRIGGER_PREPROCESSING,
	DONATION_WIDGET_UPDATE,
	GlobalState,
	MAW_INFO_JSON_DATA_UPDATE,
	SocketEventsMap,
	REQUEST_MAW_INFO_JSON_DATA,
	REQUEST_STATE,
	SETTINGS_UPDATE,
	STATE_UPDATE,
	WISH_FULLFILLED_TRIGGER,
	TTS_SPEAKER,
	CMS_UPDATE,
	REQUEST_CMS_DATA,
	CREATE_TTS_FILE,
	DONATION_TRIGGER,
} from '@cp/common'
import { configureStore } from '@reduxjs/toolkit'
import { Server, Socket } from 'socket.io'
import {
	donationAlertReducer,
	donationWidgetReducer,
	settingsReducer,
	updateDonationAlert,
	updateDonationWidget,
	updateSettings,
} from './State'
import { sessionLogger as logger } from './logger'
import { mawApiClient } from './MakeAWishApiClient'
import { updateTts } from './TTS'

export default class Session {
	private readonly store = configureStore<GlobalState>({
		reducer: {
			donationAlert: donationAlertReducer,
			donationWidget: donationWidgetReducer,
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

	public async sendDonationPreprocessing(donation: Donation) {
		this.io.to(this.channel).emit(DONATION_TRIGGER_PREPROCESSING, donation)
		if (mawApiClient.mawInfoJsonData != null) {
			this.io.to(this.channel).emit(MAW_INFO_JSON_DATA_UPDATE, mawApiClient.mawInfoJsonData)
		}

		if (donation.fullFilledWish) {
			this.sendWishFullFilled(donation)
		}
	}

	public async sendDonation(donation: Donation) {
		this.io.to(this.channel).emit(DONATION_TRIGGER, donation)
	}

	public sendWishFullFilled(donation: Donation) {
		this.io.to(this.channel).emit(WISH_FULLFILLED_TRIGGER, donation)
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
			if (mawApiClient.mawInfoJsonData != null) {
				socket.emit(MAW_INFO_JSON_DATA_UPDATE, mawApiClient.mawInfoJsonData)
			}
		})
	}

	private registerWriteHandlers(socket: Socket<SocketEventsMap, SocketEventsMap>) {
		socket.on(DONATION_TRIGGER_PREPROCESSING, (donation: Donation) => {
			this.sendDonationPreprocessing(donation)
		})

		socket.on(CREATE_TTS_FILE, async (donation: Donation) => {
			if (donation.message) {
				await updateTts(
					donation.message,
					TTS_SPEAKER[this.store.getState().settings.text2speech.language],
					donation.streamer
				)
			}
			this.sendDonation(donation)
		})

		socket.on(DONATION_ALERT_UPDATE, (donationAlertUpdate) =>
			this.store.dispatch(updateDonationAlert(donationAlertUpdate))
		)

		socket.on(DONATION_WIDGET_UPDATE, (donationWidgetUpdate) => {
			this.store.dispatch(updateDonationWidget(donationWidgetUpdate))
		})
		socket.on(SETTINGS_UPDATE, (settingsUpdate) => this.store.dispatch(updateSettings(settingsUpdate)))
	}
}
