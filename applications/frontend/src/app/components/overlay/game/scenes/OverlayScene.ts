import { DONATION_TRIGGER, GlobalState, PFTPSocketEventsMap, REQUEST_STATE, STATE_UPDATE } from '@pftp/common'
import Phaser from 'phaser'
import { Socket } from 'socket.io-client'
import { SCENES } from '../gameConfig'
import { Pig, PigAnimationKeys } from '../objects/Pig'

const PIG_PLACEHOLDER_SPRITESHEET_KEY = 'pigPlaceHolder'

const VOLUME_CHANGE_AUDIO_KEY = 'voluemChangeAudio'
const PIG_LAUGH_AUDIO_KEY = 'pigLaughAudio'
export class OverlayScene extends Phaser.Scene {
	constructor() {
		super({ key: SCENES.OVERLAY })
	}

	init(config: { socket: Socket<PFTPSocketEventsMap>; initialState: GlobalState }) {
		config.socket.on(STATE_UPDATE, (state) => {
			const activePigs = this.getActiveGameObjectsByName<Pig>('pig')
			for (const pig of activePigs) {
				pig.handleState(state.character)
			}

			/**
			 * Somehow numbers with decimals end up having more decimals
			 * than assigned, therefore it is rounded to one decimal.
			 */
			const normalizedSoundValue = Math.round(this.sound.volume * 10) / 10
			if (normalizedSoundValue !== state.settings.volume) {
				this.sound.volume = state.settings.volume
				this.sound.play(VOLUME_CHANGE_AUDIO_KEY)
			}
		})

		config.socket.on(DONATION_TRIGGER, (donation, behaviour) => {
			const activePigs = this.getActiveGameObjectsByName<Pig>('pig')
			for (const pig of activePigs) {
				pig.handleDonation(donation, behaviour)
			}
		})
	}

	preload() {
		this.load.spritesheet(PIG_PLACEHOLDER_SPRITESHEET_KEY, '/game/character.png', {
			frameWidth: 77.42857142857143,
			frameHeight: 57.272727272727,
		})
		this.load.audio(PIG_LAUGH_AUDIO_KEY, '/audio/pig_laugh.wav')
		this.load.audio(VOLUME_CHANGE_AUDIO_KEY, '/audio/volume_change.wav')
	}

	create(config: { socket: Socket<PFTPSocketEventsMap>; initialState: GlobalState }) {
		const { socket, initialState } = config
		const pigLaugh = this.sound.add(PIG_LAUGH_AUDIO_KEY)
		this.sound.pauseOnBlur = false

		this.anims.create({
			key: PigAnimationKeys.idle,
			frameRate: 6,
			frames: this.anims.generateFrameNumbers(PIG_PLACEHOLDER_SPRITESHEET_KEY, { start: 0, end: 3 }),
			repeat: -1,
		})

		this.anims.create({
			key: PigAnimationKeys.donation1,
			frameRate: 7,
			frames: this.anims.generateFrameNumbers(PIG_PLACEHOLDER_SPRITESHEET_KEY, { start: 43, end: 48 }),
			repeat: 2,
		})

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
