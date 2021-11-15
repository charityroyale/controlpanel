import { DONATION_TRIGGER, GlobalState, PFTPSocketEventsMap, REQUEST_STATE, STATE_UPDATE } from '@pftp/common'
import Phaser from 'phaser'
import { Socket } from 'socket.io-client'
import { SCENES } from '../gameConfig'
import { Pig, PigAnimationKeys } from '../objects/Pig'

const VOLUME_CHANGE_AUDIO_KEY = 'volumeChangeAudio'
const PIG_LAUGH_AUDIO_KEY = 'pigLaughAudio'

const pigAtlasKey = 'pigAtlas'
const pigIdleFrame = 'idleFrame'
const pigSleepFrame = 'sleepFrame'
const pigScratchFrame = 'scratchFrame'

export const pigIdleKey = 'idle'
export const pigSleepKey = 'sleep'
export const pigScratchKey = 'scratch'

const frameSize = 500

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
		this.load.atlas(pigAtlasKey, '/game/test.png', '/game/test.json')

		this.load.audio(PIG_LAUGH_AUDIO_KEY, '/audio/pig_laugh.wav')
		this.load.audio(VOLUME_CHANGE_AUDIO_KEY, '/audio/volume_change.wav')
	}

	create(config: { socket: Socket<PFTPSocketEventsMap>; initialState: GlobalState }) {
		const { socket, initialState } = config
		const pigLaugh = this.sound.add(PIG_LAUGH_AUDIO_KEY)
		this.sound.pauseOnBlur = false

		this.textures.addSpriteSheetFromAtlas(pigIdleFrame, {
			atlas: pigAtlasKey,
			frame: 'idle',
			frameWidth: frameSize,
			frameHeight: frameSize,
		})

		this.textures.addSpriteSheetFromAtlas(pigSleepFrame, {
			atlas: pigAtlasKey,
			frame: 'sleep',
			frameWidth: frameSize,
			frameHeight: frameSize,
		})

		this.textures.addSpriteSheetFromAtlas(pigScratchFrame, {
			atlas: pigAtlasKey,
			frame: 'scratch',
			frameWidth: frameSize,
			frameHeight: frameSize,
		})

		const pigIdleConfig = {
			key: pigIdleKey,
			frames: this.anims.generateFrameNumbers(pigIdleFrame, { start: 0, end: 21 }),
			frameRate: 7,
			repeat: -1,
		}

		const pigSleepConfig = {
			key: pigSleepKey,
			frames: this.anims.generateFrameNumbers(pigSleepFrame, { start: 0, end: 21 }),
			frameRate: 7,
			repeat: 0,
		}

		const pigScratchConfig = {
			key: pigScratchKey,
			frames: this.anims.generateFrameNumbers(pigScratchFrame, { start: 0, end: 12 }),
			frameRate: 7,
			repeat: 0,
		}

		this.anims.create(pigIdleConfig)
		this.anims.create(pigSleepConfig)
		this.anims.create(pigScratchConfig)

		new Pig(this, { x: 1920 / 2, y: 1080 / 2, texture: pigAtlasKey, pigLaugh }, initialState.character, socket)
		socket.emit(REQUEST_STATE)
	}

	private getActiveGameObjectsByName<T>(name: string) {
		return this.children.list.filter((child) => child.name === name) as never as T[]
	}
}
