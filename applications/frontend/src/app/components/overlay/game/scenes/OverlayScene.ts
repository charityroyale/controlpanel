import { Donation, DONATION_TRIGGER, GlobalState, PFTPSocketEventsMap, REQUEST_STATE, STATE_UPDATE } from '@pftp/common'
import Phaser from 'phaser'
import { Socket } from 'socket.io-client'
import { SCENES } from '../gameConfig'
import { Pig } from '../objects/Pig'

const PIG_PLACEHOLDER_SPRITESHEET_KEY = 'pigPlaceHolder'
const VOLUME_CHANGE_AUDIO_KEY = 'voluemChangeAudio'
const PIG_LAUGH_AUDIO_KEY = 'pigLaughAudio'
export class OverlayScene extends Phaser.Scene {
	constructor() {
		super({ key: SCENES.OVERLAY })
	}

	init(config: { socket: Socket<PFTPSocketEventsMap>; initialState: GlobalState }) {
		config.socket.on(STATE_UPDATE, (state: GlobalState) => {
			const activePigs = this.getActiveGameObjectsByName<Pig>('pig')
			for (const pig of activePigs) {
				pig.handleState(state.character)
			}

			if (this.sound.volume !== state.settings.volume) {
				this.sound.volume = state.settings.volume
				this.sound.play(VOLUME_CHANGE_AUDIO_KEY)
			}
		})

		config.socket.on(DONATION_TRIGGER, (donation: Donation) => {
			const activePigs = this.getActiveGameObjectsByName<Pig>('pig')
			for (const pig of activePigs) {
				pig.handleDonation(donation)
			}
		})
	}

	preload() {
		this.load.spritesheet(PIG_PLACEHOLDER_SPRITESHEET_KEY, '/pig_placeholder.png', {
			frameWidth: 225,
			frameHeight: 225,
		})
		this.load.audio(PIG_LAUGH_AUDIO_KEY, '/audio/pig_laugh.wav')
		this.load.audio(VOLUME_CHANGE_AUDIO_KEY, '/audio/volume_change.wav')
	}

	create(config: { socket: Socket<PFTPSocketEventsMap>; initialState: GlobalState }) {
		const { socket, initialState } = config
		const pigLaugh = this.sound.add(PIG_LAUGH_AUDIO_KEY)
		this.sound.pauseOnBlur = false

		new Pig(
			this,
			{ x: 1920 / 2, y: 1080 / 2, texture: PIG_PLACEHOLDER_SPRITESHEET_KEY, pigLaugh },
			initialState.character,
			socket
		)
		socket.emit(REQUEST_STATE)
	}

	private getActiveGameObjectsByName<T>(name: string) {
		return this.children.list.filter((child) => child.name === name) as never as T[]
	}
}
