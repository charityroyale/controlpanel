import {
	CHARACTER_UPDATE,
	Donation,
	DONATION_TRIGGER,
	GlobalState,
	PFTPSocketEventsMap,
	PigStateType,
	REQUEST_STATE,
	SETTINGS_UPDATE,
	STATE_UPDATE,
} from '@pftp/common'
import { configureStore } from '@reduxjs/toolkit'
import { Server, Socket } from 'socket.io'
import { characterReducer, settingsReducer, updateCharacter, updateSettings } from './State'
import { logger } from './logger'

export default class Session {
	private readonly store = configureStore<GlobalState>({
		reducer: {
			character: characterReducer,
			settings: settingsReducer,
		},
	})

	constructor(private readonly channel: string, private readonly io: Server<PFTPSocketEventsMap>) {
		this.store.subscribe(() => {
			this.io.to(this.channel).emit(STATE_UPDATE, this.store.getState())
			console.log(this.store.getState())
		})
	}

	public async handleNewWriteConnection(socket: Socket<PFTPSocketEventsMap, PFTPSocketEventsMap>) {
		await this.handleNewReadConnection(socket)
		this.registerWriteHandlers(socket)
	}

	public async handleNewReadConnection(socket: Socket<PFTPSocketEventsMap, PFTPSocketEventsMap>) {
		await socket.join(this.channel)

		socket.on('disconnect', (reason) => {
			logger.info(`socket ${socket.id} disconnected with reason: ${reason}`)
		})

		socket.emit(STATE_UPDATE, this.store.getState())

		this.registerReadHandlers(socket)
	}

	private registerReadHandlers(socket: Socket<PFTPSocketEventsMap, PFTPSocketEventsMap>) {
		socket.on(REQUEST_STATE, () => socket.emit(STATE_UPDATE, this.store.getState()))
	}

	private registerWriteHandlers(socket: Socket<PFTPSocketEventsMap, PFTPSocketEventsMap>) {
		socket.on(DONATION_TRIGGER, (donation: Donation, behaviour: PigStateType) => {
			this.io.to(this.channel).emit(DONATION_TRIGGER, donation, behaviour)
		})
		socket.on(CHARACTER_UPDATE, (characterUpdate) => this.store.dispatch(updateCharacter(characterUpdate)))
		socket.on(SETTINGS_UPDATE, (settingsUpdate) => this.store.dispatch(updateSettings(settingsUpdate)))
	}
}
