import { DONATION_TRIGGER, GlobalState, PFTPSocketEventsMap, REQUEST_STATE, STATE_UPDATE } from '@pftp/common'
import Phaser, { Physics } from 'phaser'
import { Socket } from 'socket.io-client'
import { SCENES } from '../gameConfig'
import { OverlayContainer } from '../objects/OverlayContainer'
import { Pig } from '../objects/Pig'
import { Sign } from '../objects/Sign'
const { FloatBetween } = Phaser.Math

const VOLUME_CHANGE_AUDIO_KEY = 'volumeChangeAudio'
const PIG_LAUGH_AUDIO_KEY = 'pigLaughAudio'

const signKey = 'sign'

export const coin1Key = 'coin1'
export const coin1TextColor = '#433166'
export const coin2Key = 'coin2'
export const coin2TextColor = '#5c6b1f'
export const coin3Key = 'coin3'
export const coin3TextColor = '#af471e'
export const coin4Key = 'coin4'
export const coin4TextColor = '#7f2422'
export const coin5Key = 'coin5'
export const coin5TextColor = '#357a96'
export const coin6Key = 'coin6'
export const coin6TextColor = '#d17a1c'

export const titleKey = 'title'

const flaresAtlasKey = 'flaresAtlas'
const pigAtlasKey = 'pigAtlas'
const pigIdleFrame = 'idleFrame'
const pigSleepSpriteSheet = 'sleepFrame'
const pigScratchFrame = 'scratchFrame'
const pigDonationFrame = 'donationFrame'

export const pigIdleKey = 'idle'
export const pigSleepKey = 'sleep'
export const pigSleepInKey = 'sleepIn'
export const pigSleepOutKey = 'sleepOut'
export const pigScratchKey = 'scratch'
export const pigDonationKey = 'donation'
export const pigDonationInKey = 'donationIn'
export const pigDonationOutKey = 'donationOut'

const frameSize = 500
const coinSize = 500

// Inspired by https://codepen.io/samme/pen/eYEearb @sammee on github
const fireworksEmitterConfig = {
	alpha: { start: 1, end: 0, ease: 'Cubic.easeIn' },
	angle: { start: 0, end: 360, steps: 100 },
	blendMode: 'ADD',
	frame: { frames: ['red', 'yellow', 'blue'], cycle: true, quantity: 500 },
	frequency: 1000,
	gravityY: 600,
	lifespan: 1800,
	quantity: 500,
	reserve: 500,
	scale: { min: 0.02, max: 0.35 },
	speed: { min: 200, max: 600 },
	x: 550,
	y: 350,
}

export class OverlayScene extends Phaser.Scene {
	public pigWithSignContainer: OverlayContainer | null = null

	constructor() {
		super({ key: SCENES.OVERLAY })
	}

	init(config: { socket: Socket<PFTPSocketEventsMap>; initialState: GlobalState }) {
		config.socket.on(STATE_UPDATE, (state) => {
			this.pigWithSignContainer?.handleState(state.character)
			const pig = this.pigWithSignContainer?.getByName('pig') as Pig
			pig.handleState(state.character)

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

		config.socket.on(DONATION_TRIGGER, (donation) => {
			const pig = this.pigWithSignContainer?.getByName('pig') as Pig
			pig.handleDonation(donation)
		})
	}

	preload() {
		this.load.atlas(pigAtlasKey, '/game/pig_atlas.png', '/game/pig_atlas.json')
		this.load.atlas(flaresAtlasKey, '/game/flares.png', '/game/flares.json')

		this.load.spritesheet(signKey, '/game/sign.png', {
			frameWidth: 500,
			frameHeight: 500,
		})

		this.load.spritesheet(coin1Key, `/game/coins/coin1.png`, {
			frameWidth: coinSize,
			frameHeight: coinSize,
		})
		this.load.spritesheet(coin2Key, `/game/coins/coin2.png`, {
			frameWidth: coinSize,
			frameHeight: coinSize,
		})
		this.load.spritesheet(coin3Key, `/game/coins/coin3.png`, {
			frameWidth: coinSize,
			frameHeight: coinSize,
		})
		this.load.spritesheet(coin4Key, `/game/coins/coin4.png`, {
			frameWidth: coinSize,
			frameHeight: coinSize,
		})
		this.load.spritesheet(coin5Key, `/game/coins/coin5.png`, {
			frameWidth: coinSize,
			frameHeight: coinSize,
		})
		this.load.spritesheet(coin6Key, `/game/coins/coin6.png`, {
			frameWidth: coinSize,
			frameHeight: coinSize,
		})

		this.load.spritesheet(titleKey, '/game/strip.png', {
			frameWidth: 1188,
			frameHeight: 145,
		})

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

		this.textures.addSpriteSheetFromAtlas(pigScratchFrame, {
			atlas: pigAtlasKey,
			frame: 'scratch',
			frameWidth: frameSize,
			frameHeight: frameSize,
		})

		this.textures.addSpriteSheetFromAtlas(pigDonationFrame, {
			atlas: pigAtlasKey,
			frame: 'donation',
			frameWidth: frameSize,
			frameHeight: frameSize,
		})

		this.textures.addSpriteSheetFromAtlas(pigSleepSpriteSheet, {
			atlas: pigAtlasKey,
			frame: 'sleep',
			frameWidth: frameSize,
			frameHeight: frameSize,
		})

		const pigIdleConfig: Phaser.Types.Animations.Animation = {
			key: pigIdleKey,
			frames: this.anims.generateFrameNumbers(pigIdleFrame, { end: 21 }),
			duration: 3750,
			repeat: -1,
		}

		const pigDonationInConfig: Phaser.Types.Animations.Animation = {
			key: pigDonationInKey,
			frames: this.anims.generateFrameNumbers(pigDonationFrame, { start: 0, end: 8 }),
			duration: 1000,
			repeat: 0,
		}

		const pigDonationConfig: Phaser.Types.Animations.Animation = {
			key: pigDonationKey,
			frames: this.anims.generateFrameNumbers(pigDonationFrame, { start: 9, end: 10 }),
			duration: 200,
			repeat: -1,
		}

		const pigDonationOutConfig: Phaser.Types.Animations.Animation = {
			key: pigDonationOutKey,
			frames: this.anims.generateFrameNumbers(pigDonationFrame, { start: 11, end: 17 }),
			duration: 1000,
			repeat: 0,
		}

		const pigScratchConfig: Phaser.Types.Animations.Animation = {
			key: pigScratchKey,
			frames: this.anims.generateFrameNumbers(pigScratchFrame, { end: 12 }),
			duration: 1800,
			repeat: 0,
		}

		const pigSleepInConfig: Phaser.Types.Animations.Animation = {
			key: pigSleepInKey,
			frames: this.anims.generateFrameNumbers(pigSleepSpriteSheet, { start: 0, end: 8 }),
			duration: 1200,
			repeat: 0,
		}

		const pigSleepConfig: Phaser.Types.Animations.Animation = {
			key: pigSleepKey,
			frames: this.anims.generateFrameNumbers(pigSleepSpriteSheet, { start: 9, end: 17 }),
			duration: 1500,
			repeat: -1,
		}

		const pigSleepOutConfig: Phaser.Types.Animations.Animation = {
			key: pigSleepOutKey,
			frames: this.anims.generateFrameNumbers(pigSleepSpriteSheet, { start: 17, end: 21 }),
			duration: 700,
			repeat: 0,
		}

		this.anims.create(pigIdleConfig)
		this.anims.create(pigSleepConfig)
		this.anims.create(pigSleepInConfig)
		this.anims.create(pigSleepOutConfig)
		this.anims.create(pigScratchConfig)
		this.anims.create(pigDonationConfig)
		this.anims.create(pigDonationInConfig)
		this.anims.create(pigDonationOutConfig)

		const coinGroup = this.add.group()

		const flareParticles = this.add.particles(flaresAtlasKey)
		const fireworksEmitter = flareParticles.createEmitter(fireworksEmitterConfig)
		fireworksEmitter.stop()

		const sign = new Sign(this, -175, 0, signKey)
		const pig = new Pig(
			this,
			{ x: 0, y: 0, texture: pigAtlasKey, pigLaugh },
			initialState.character,
			coinGroup,
			fireworksEmitter
		)

		this.pigWithSignContainer = new OverlayContainer(this, initialState.character, socket, {
			children: [sign, pig],
		})
		this.input.setDraggable(this.pigWithSignContainer)

		this.addMouthCollider(this.pigWithSignContainer, coinGroup)

		const { width, height } = this.scale

		// mhmhm
		this.time.addEvent({
			repeat: -1,
			callback: () => {
				fireworksEmitter.setPosition(width * FloatBetween(0.25, 0.75), height * FloatBetween(0, 0.5))
			},
		})

		socket.emit(REQUEST_STATE)
	}

	public addMouthCollider(container: Phaser.GameObjects.Container, coinGroup: Phaser.GameObjects.Group) {
		const colliderSprite = new Phaser.GameObjects.Sprite(this, 0, 0, coin2Key)
		const physicsBody = new Physics.Arcade.Body(this.physics.world, colliderSprite)

		colliderSprite.body = physicsBody
		colliderSprite.setVisible(false)
		colliderSprite.body.allowGravity = false
		colliderSprite.body.setSize(170, 170)
		colliderSprite.name = 'colliderSprite'

		const target = this.physics.add.existing(colliderSprite)
		container.add(colliderSprite)

		this.physics.add.overlap(
			coinGroup,
			target,
			(currentGameObject) => {
				currentGameObject.destroy()
				const pig = container.getByName('pig') as Pig
				pig.play(pigDonationOutKey).chain(pigIdleKey)
				container.getAll('name', 'cointext').map((el) => el.destroy())
			},
			undefined,
			coinGroup
		)
	}
}
