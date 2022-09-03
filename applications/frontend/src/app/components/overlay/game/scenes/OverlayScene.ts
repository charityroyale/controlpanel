import { DONATION_TRIGGER, GlobalState, PFTPSocketEventsMap, REQUEST_STATE, STATE_UPDATE } from '@pftp/common'

import Phaser, { Physics } from 'phaser'
import { Socket } from 'socket.io-client'
import { SCENES } from '../gameConfig'
import { Text2Speech } from '../objects/behaviour/Text2Speech'
import { Alert } from '../objects/containers/alert/Alert'
import {
	DonationBannerContainer,
	donationAlertContainerName,
} from '../objects/containers/donationBanner/DonationBannerContainer'
import { DonationAlertBanner } from '../objects/containers/donationBanner/DonationBanner'
import { Star } from '../objects/Star'

const VOLUME_CHANGE_AUDIO_KEY = 'volumeChangeAudio'
const DONATION_ALERT_AUDIO_KEY = 'donationAlertAudio'

export const FIREWORKS_START_AUDIO_KEY = 'fireworksStartAudio'
export const FIREWORKS_SOUND_1_AUDIO_KEY = 'fireworksSound1Audio'
export const FIREWORKS_SOUND_2_AUDIO_KEY = 'fireworksSound2Audio'
export const STRAR_SOUND_AUDIO_KEY = 'starSound'
export const STAR_RAIN_SOUND_AUDIO_KEY = 'starRainAudio'

export const blueStarKey = 'blueStar'
const whiteStarFollowerKey = 'whiteFollower'

export const donationAlertKey = 'donationAlertVideo'
export const donationAlertWithMessageKey = 'donationAlertWithMessageVideo'

const flaresAtlasKey = 'flaresAtlas'

// Inspired by https://codepen.io/samme/pen/eYEearb @sammee on github
const fireworksEmitterConfig: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
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
	public alert: Alert | null = null
	public donationBannerDontainer: DonationBannerContainer | null = null
	public isLockedOverlay = false
	public text2speech: Text2Speech | null = null

	constructor() {
		super({ key: SCENES.OVERLAY })
	}

	init(config: { socket: Socket<PFTPSocketEventsMap>; initialState: GlobalState }) {
		this.text2speech = new Text2Speech(
			config.initialState.settings.text2speech.language,
			config.initialState.settings.text2speech.volume
		)

		config.socket.on(STATE_UPDATE, (state) => {
			this.donationBannerDontainer?.handleState(state.donationAlert)
			this.text2speech?.handleState(state.settings)

			/**
			 * Somehow numbers with decimals end up having more decimals
			 * than assigned, therefore it is rounded to one decimal.
			 */
			const normalizedSoundValue = Math.round(this.sound.volume * 10) / 10
			if (normalizedSoundValue !== state.settings.volume) {
				this.sound.volume = state.settings.volume
				this.sound.play(VOLUME_CHANGE_AUDIO_KEY)
			}

			this.isLockedOverlay = state.settings.isLockedOverlay
		})

		config.socket.on(DONATION_TRIGGER, (donation) => {
			this.alert?.handleDonation(donation)
		})
	}

	preload() {
		// VIDEOS
		this.load.video(donationAlertKey, '/game/donationalert/donation_alert.webm', 'loadeddata', false, true)
		this.load.video(
			donationAlertWithMessageKey,
			'/game/donationalert/donation_alert_with_message.webm',
			'loadeddata',
			false,
			true
		)

		// ATLAS, SPRITESHEETS & IMAGES
		this.load.atlas(flaresAtlasKey, '/game/flares.png', '/game/flares.json')
		this.load.spritesheet(blueStarKey, '/game/stars/blue_star.png', {
			frameWidth: 250,
			frameHeight: 250,
		})
		this.load.image(whiteStarFollowerKey, '/game/stars/star_flare.png')

		// AUDIO ASSETS
		this.load.audio(VOLUME_CHANGE_AUDIO_KEY, '/audio/volume_change.wav')
		this.load.audio(DONATION_ALERT_AUDIO_KEY, '/audio/donation_alert.mp3')
		this.load.audio(FIREWORKS_START_AUDIO_KEY, '/audio/fireworks.ogg')
		this.load.audio(FIREWORKS_SOUND_1_AUDIO_KEY, '/audio/fireworks_sound_1.ogg')
		this.load.audio(FIREWORKS_SOUND_2_AUDIO_KEY, '/audio/fireworks_sound_2.ogg')
		this.load.audio(STAR_RAIN_SOUND_AUDIO_KEY, '/audio/star_rain.ogg')
	}

	create(config: { socket: Socket<PFTPSocketEventsMap>; initialState: GlobalState }) {
		const { socket, initialState } = config
		const starGroup = this.add.group()

		const flareParticles = this.add.particles(flaresAtlasKey)

		this.isLockedOverlay = initialState.settings.isLockedOverlay

		// TODO: move emitter logic to donationbehaviour class
		const fireworksEmitter = flareParticles.createEmitter(fireworksEmitterConfig)
		fireworksEmitter.stop()

		this.createStarRainInstance(starGroup)

		// create pig container items
		this.alert = new Alert(
			this,
			this.text2speech!,
			starGroup,
			this.add.particles(whiteStarFollowerKey),
			fireworksEmitter
		)

		// create donationAlerts
		const dontainerBanner = new DonationAlertBanner(this, 0, 0, initialState.donationAlert, donationAlertKey)
		const donationAlertWithMessage = new DonationAlertBanner(
			this,
			0,
			0,
			initialState.donationAlert,
			donationAlertWithMessageKey
		)

		// create containers
		this.donationBannerDontainer = new DonationBannerContainer(this, initialState.donationAlert, socket, {
			children: [dontainerBanner, donationAlertWithMessage],
		})

		this.input.setDraggable([this.donationBannerDontainer])
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.input.on('drag', (_pointer: any, _gameObject: any, dragX: any, dragY: any) => {
			if (_gameObject.name === donationAlertContainerName && !this.isLockedOverlay) {
				_gameObject.x = dragX
				_gameObject.y = dragY
			}
		})

		// global world env objects and settings
		this.sound.pauseOnBlur = false
		socket.emit(REQUEST_STATE)
	}

	private createStarRainInstance(starGroup: Phaser.GameObjects.Group) {
		const { height } = this.scale

		const starColliderSprite = new Phaser.Physics.Arcade.Sprite(this, 960, height + 40, blueStarKey)
		const physicsBody = new Physics.Arcade.Body(this.physics.world, starColliderSprite)
		physicsBody.setSize(1920, 10)
		physicsBody.allowGravity = false
		physicsBody.immovable = true
		starColliderSprite.body = physicsBody

		this.physics.add.existing(starColliderSprite)
		this.physics.world.setBoundsCollision(true, true, false, false)
		this.physics.add.collider(starGroup, starColliderSprite, (gameObject1) => {
			const star = gameObject1 as Star
			star.setVelocityX(Phaser.Math.Between(-200, 200))

			if (star.bumps >= 1) {
				star.starEmitter.killAll()
				star.starEmitter.remove()
				star.destroy()
			} else {
				star.bumps += 1
			}
		})
	}
}
