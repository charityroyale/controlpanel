import {
	Donation,
	DONATION_ALERT_UPDATE,
	DONATION_TRIGGER,
	DONATION_WIDGET_UPDATE,
	GlobalState,
	MAW_INFO_JSON_DATA_UPDATE,
	PFTPSocketEventsMap,
	REQUEST_MAW_INFO_JSON_DATA,
	REQUEST_STATE,
	SETTINGS_UPDATE,
	STATE_UPDATE,
} from '@pftp/common'
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

export default class Session {
	private readonly store = configureStore<GlobalState>({
		reducer: {
			donationAlert: donationAlertReducer,
			donationWidget: donationWidgetReducer,
			settings: settingsReducer,
		},
	})

	constructor(private readonly channel: string, private readonly io: Server<PFTPSocketEventsMap>) {
		this.store.subscribe(() => {
			this.io.to(this.channel).emit(STATE_UPDATE, this.store.getState())
			// console.log(this.store.getState())
		})
	}

	public async handleNewReadWriteConnection(socket: Socket<PFTPSocketEventsMap, PFTPSocketEventsMap>) {
		await this.handleNewReadConnection(socket)
		this.registerWriteHandlers(socket)
	}

	public async handleNewReadConnection(socket: Socket<PFTPSocketEventsMap, PFTPSocketEventsMap>) {
		await socket.join(this.channel)

		socket.on('disconnect', (reason) => {
			logger.info(`Socket ${socket.id} disconnected with reason: ${reason}`)
		})

		socket.emit(STATE_UPDATE, this.store.getState())
		if (mawApiClient.mawInfoJsonData != null) {
			socket.emit(MAW_INFO_JSON_DATA_UPDATE, mawApiClient.mawInfoJsonData)
		}

		this.registerReadHandlers(socket)
	}

	public sendDonation(donation: Donation) {
		this.io.to(this.channel).emit(DONATION_TRIGGER, donation)
		if (mawApiClient.mawInfoJsonData != null) {
			this.io.to(this.channel).emit(MAW_INFO_JSON_DATA_UPDATE, mawApiClient.mawInfoJsonData)
		}
	}

	private registerReadHandlers(socket: Socket<PFTPSocketEventsMap, PFTPSocketEventsMap>) {
		socket.on(REQUEST_STATE, () => socket.emit(STATE_UPDATE, this.store.getState()))
		socket.on(REQUEST_MAW_INFO_JSON_DATA, () => {
			if (mawApiClient.mawInfoJsonData != null) {
				socket.emit(MAW_INFO_JSON_DATA_UPDATE, mawApiClient.mawInfoJsonData)
			}
		})
	}

	private registerWriteHandlers(socket: Socket<PFTPSocketEventsMap, PFTPSocketEventsMap>) {
		socket.on(DONATION_TRIGGER, (donation: Donation) => {
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
