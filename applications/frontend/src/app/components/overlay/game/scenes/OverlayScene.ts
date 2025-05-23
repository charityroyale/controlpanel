import {
	GlobalState,
	MAW_INFO_JSON_DATA_UPDATE,
	SocketEventsMap,
	REQUEST_MAW_INFO_JSON_DATA,
	REQUEST_STATE,
	STATE_UPDATE,
	DONATION_TRIGGER,
} from '@cp/common'

import Phaser, { Physics } from 'phaser'
import { Socket } from 'socket.io-client'
import { SCENES } from '../gameConfig'
import { Alert } from '../objects/containers/alert/Alert'
import { DonationBannerContainer } from '../objects/containers/donationBanner/DonationBannerContainer'
import { DonationAlertVideo } from '../objects/containers/donationBanner/DonationBanner'
import { Star } from '../objects/Star'
import { DonationWidgetContainer } from '../objects/containers/donationwidget/DonationWidgetContainer'
import { DonationWidgetBackgroundFrame } from '../objects/containers/donationwidget/DonationWidgetBackgroundFrame'
import { DonationWidgetLeftWithIcon } from '../objects/containers/donationwidget/DonationWidgetLeftWithIcon'
import { DonationWidgetFullFilled } from '../objects/containers/donationwidget/DonationWidgetFullFilled'
import { DonationWidgetWishHeading } from '../objects/containers/donationwidget/text/DonationWidgetWishHeading'
import { DonationWidgetWishSubHeading } from '../objects/containers/donationwidget/text/DonationWidgetWishSubHeading'
import { DonationWidgetWishLastDonationStatic } from '../objects/containers/donationwidget/text/DonationWidgetWishLastDonationStatic'
import { DonationWidgetWishTopDonationStatic } from '../objects/containers/donationwidget/text/DonationWidgetWishTopDonationStatic'
import { DonationWidgetWishLastDonation } from '../objects/containers/donationwidget/text/DonationWidgetWishLastDonation'
import { DonationWidgetWishTopDonation } from '../objects/containers/donationwidget/text/DonationWidgetWishTopDonation'
import {
	DonationWidgetProgressBar,
	donationWidgetProgressBarBackgroundName,
	donationWidgetProgressBarName,
} from '../objects/containers/donationwidget/DonationWidgetProgressBar'
import { DonationWidgetProgressBarText } from '../objects/containers/donationwidget/text/DonationWidgetProgressBarText'
import { SocketAuth } from '../../../../provider/SocketProvider'
import {
	DonationWidgetMiddleTextStatic,
	DonationWidgetPostfixTextStatic,
	DonationWidgetPrefixTextStatic,
} from '../objects/containers/donationwidget/text/DonationWidgetWishFullFilledStatic'
import {
	DonationWidgetWishFullFilledAmount,
	DonationWidgetWishFullFilledKidName,
} from '../objects/containers/donationwidget/text/DonationWidgetWishFullFilled'
import { DonationWidgetLoaderFrame } from '../objects/containers/donationwidget/DonationWidgetLoaderFrame'
import { DonationWidgetLoaderFrameText } from '../objects/containers/donationwidget/text/DonationWidgetLoaderFrameText'
import {
	DONATION_ALERT_CLICK_NOICE_AUDIO_KEY,
	DONATION_ALERT_YEY_AUDIO_KEY,
	FIREWORKS_SOUND_1_AUDIO_KEY,
	FIREWORKS_SOUND_2_AUDIO_KEY,
	GTA_RESPECT_SOUND_AUDIO_KEY,
	STAR_RAIN_SOUND_AUDIO_KEY,
} from '../objects/config/sound'
import { DonationWidgetLogo } from '../objects/containers/donationwidget/DonationWidgetLogo'
import { DonationGoalContainer } from '../objects/containers/donationgoal/DonationGoalContainer'
import {
	DonationGoalProgressbar,
	donationGoalProgressBackgroundBarName,
	donationGoalProgressBarName,
} from '../objects/containers/donationgoal/DonationGoalProgressbar'
import { LuckiestGuyText } from '../objects/common/LuckiestGuyText'
import { SairaCondensedText } from '../objects/common/SairaCondensedText'
import { DonationChallengeContainer } from '../objects/containers/donationchallenge/DonationChallengeContainer'

export const MAKE_A_WISH_LOGO_IMAGE_KEY = 'makeAwishLogoImage'
export const DONATION_WIDGET_BACKGROUND = 'donationWidgetBackground'
export const DONATION_WIDGET_STATE_LOADING = 'donatioNWidgetStateLoading'
export const DONATION_WIDGET_FULLFILLED = 'donationWidgetStateFullfilled'
export const DONATION_WIDGET_LEFT = 'donationWidgetLeft'
export const CHARITY_ROYALE_LOGO_IMAGE_KEY = 'charityRoyaleLogoImage'

export const blueStarKey = 'blueStar'
export const whiteStarFollowerKey = 'whiteFollower'

export const donationAlertKey = 'donationAlertVideo'
export const donationAlertWithMessageKey = 'donationAlertWithMessageVideo'

export const flaresAtlasKey = 'flaresAtlas'

const TTS_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/static`
export const TTS_KEY = 'ttsaudio'

export class OverlayScene extends Phaser.Scene {
	public alert: Alert | null = null
	public donationBannerContainer: DonationBannerContainer | null = null
	public donationWidgetContainer: DonationWidgetContainer | null = null
	public donationGoalContainer: DonationGoalContainer | null = null
	public donationChallengeContainer: DonationChallengeContainer | null = null

	public isLockedOverlay = false

	private ttsVolume = 0

	constructor() {
		super({ key: SCENES.OVERLAY })
	}

	/**
	 * !!!! WATCH OUT !!!!
	 * Possible Issue with access to gameobjects from socket io event before it gets rendered
	 * --> Careful, socket io events may be triggered before initial render -->
	 * therefore some gameobjects or cache/assets can be missing.
	 */
	init(config: { socket: Socket<SocketEventsMap>; initialState: GlobalState }) {
		config.socket.on(STATE_UPDATE, (state) => {
			this.donationBannerContainer?.handleState(state.donationAlert)
			this.donationGoalContainer?.handleState(state.donationGoal)
			this.donationWidgetContainer?.handleState(state.donationWidget)
			this.donationChallengeContainer?.handleState(state.donationChallengeWidget)

			/**
			 * Somehow numbers with decimals end up having more decimals
			 * than assigned, therefore it is rounded to one decimal.
			 */
			const normalizedSoundValue = Math.round(this.sound.volume * 10) / 10
			if (normalizedSoundValue !== state.settings.volume) {
				this.sound.volume = state.settings.volume
			}

			/**
			 * Somehow numbers with decimals end up having more decimals
			 * than assigned, therefore it is rounded to one decimal.
			 */
			const normalizedSoundValue2 = Math.round(this.ttsVolume * 10) / 10
			if (normalizedSoundValue2 !== state.settings.text2speech.volume) {
				this.ttsVolume = state.settings.text2speech.volume
			}

			this.isLockedOverlay = state.settings.isLockedOverlay

			this.events.emit('ttsUpdated', state.settings.text2speech.minDonationAmount)
		})

		config.socket.on(DONATION_TRIGGER, (donation) => {
			this.alert?.handleDonation(donation)
			this.donationWidgetContainer?.updateWishContentText()
		})

		config.socket.on(MAW_INFO_JSON_DATA_UPDATE, (mawInfoJsonData) => {
			this.donationWidgetContainer?.updateWishContentText()
			this.donationWidgetContainer?.handleMawJsonStateUpdate(
				mawInfoJsonData,
				(config.socket.auth as SocketAuth).channel
			)

			this.donationChallengeContainer?.handleMawJsonStateUpdate(
				mawInfoJsonData,
				(config.socket.auth as SocketAuth).channel
			)
			config.socket.emit(REQUEST_STATE)
		})

		this.time.addEvent({
			delay: 7500,
			callback: () => {
				config.socket.emit(REQUEST_MAW_INFO_JSON_DATA)
			},
			loop: true,
		})
	}

	preload() {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		this.load.rexWebFont({
			google: {
				families: ['Luckiest Guy', 'Saira Condensed'],
			},
		})

		// VIDEOS
		this.load.video(donationAlertKey, '/game/donationalert/donation_alert.webm', true)
		this.load.video(donationAlertWithMessageKey, '/game/donationalert/donation_alert_with_message.webm', true)

		this.load.atlas('purple_confetti', '/game/confetti/purple.png', '/game/confetti/purple.json')
		this.load.atlas('blue_confetti', '/game/confetti/blue.png', '/game/confetti/blue.json')
		this.load.atlas('green_confetti', '/game/confetti/green.png', '/game/confetti/green.json')
		this.load.atlas('orange_confetti', '/game/confetti/orange.png', '/game/confetti/orange.json')
		this.load.atlas('red_confetti', '/game/confetti/red.png', '/game/confetti/red.json')

		// ATLAS, SPRITESHEETS & IMAGES
		this.load.atlas(flaresAtlasKey, '/game/flares.png', '/game/flares.json')
		this.load.spritesheet(blueStarKey, '/game/stars/blue_star.png', {
			frameWidth: 250,
			frameHeight: 250,
		})
		this.load.image(whiteStarFollowerKey, '/game/stars/star_flare.png')

		this.load.image(
			MAKE_A_WISH_LOGO_IMAGE_KEY,
			'/game/donationwidget/donationwidget_make_a_wish_international_logo.png'
		)
		this.load.image(CHARITY_ROYALE_LOGO_IMAGE_KEY, '/game/donationwidget/donation_widget_charity_royale_logo.png')
		this.load.image(DONATION_WIDGET_BACKGROUND, '/game/donationwidget/donationwidget_frame.png')
		this.load.image(DONATION_WIDGET_LEFT, '/game/donationwidget/donation_widget_left_without_logo.png')
		this.load.image(DONATION_WIDGET_FULLFILLED, '/game/donationwidget/donationwidget_wish_fullfilled.png')
		this.load.image(DONATION_WIDGET_STATE_LOADING, '/game/donationwidget/donationwidget_state_loading.png')

		this.load.audio(FIREWORKS_SOUND_1_AUDIO_KEY, '/audio/sfx/fireworks_sound_1.mp3')
		this.load.audio(FIREWORKS_SOUND_2_AUDIO_KEY, '/audio/sfx/fireworks_sound_2.mp3')
		this.load.audio(STAR_RAIN_SOUND_AUDIO_KEY, '/audio/sfx/star_rain.mp3')
		this.load.audio(GTA_RESPECT_SOUND_AUDIO_KEY, '/audio/sfx/gta_respect.mp3')

		this.load.audio(DONATION_ALERT_YEY_AUDIO_KEY, '/audio/alert/donation_alert_yey.mp3')
		this.load.audio(DONATION_ALERT_CLICK_NOICE_AUDIO_KEY, '/audio/alert/donation_alert_click_noice.mp3')
	}

	create(config: { socket: Socket<SocketEventsMap>; initialState: GlobalState }) {
		const { socket, initialState } = config
		const starGroup = this.add.group()

		// const flareParticles = this.add.particles(flaresAtlasKey)
		this.ttsVolume = initialState.settings.text2speech.volume

		const playTTS = (url: string) => {
			if (this.cache.audio.exists(TTS_KEY)) {
				try {
					const audio = new Audio(url)
					audio.volume = this.ttsVolume > 0.2 ? this.ttsVolume - 0.1 : this.ttsVolume
					audio.play()
					audio.addEventListener('ended', () => {
						audio.remove()
						console.log('Audio playback completed and instance destroyed.')
					})
				} catch (e) {
					console.log(e)
				}
			} else {
				console.log('Sadly the TTS failed. Contact orga in Discord.')
			}
		}

		let loader
		const loadTTS = (id: number) => {
			this.cache.audio.remove(TTS_KEY)
			loader = this.load.audio(TTS_KEY, `${TTS_URL}/${id}.mp3`)
			loader.on('complete', () => {
				this.time.addEvent({
					delay: 2500,
					callback: () => playTTS(`${TTS_URL}/${id}.mp3`),
				})
				this.load.removeListener('complete')
			})

			loader.start()
		}
		this.events.on('loadAndPlayTTS', loadTTS)

		this.isLockedOverlay = initialState.settings.isLockedOverlay

		this.createStarRainInstance(starGroup)

		// create alert
		this.alert = new Alert(this, starGroup, initialState.settings.text2speech.minDonationAmount)

		// create donationAlerts
		const dontainerBanner = new DonationAlertVideo(this, 0, 0, initialState.donationAlert, donationAlertKey)
		const donationAlertWithMessage = new DonationAlertVideo(
			this,
			0,
			0,
			initialState.donationAlert,
			donationAlertWithMessageKey
		)

		// create containers
		this.donationBannerContainer = new DonationBannerContainer(this, initialState.donationAlert, socket, {
			children: [dontainerBanner, donationAlertWithMessage],
		})

		const donationWidgetBackgroundFrame = new DonationWidgetBackgroundFrame(
			this,
			0,
			0,
			initialState.donationWidget,
			DONATION_WIDGET_BACKGROUND
		)
		const donationWidgetLeftWithIcon = new DonationWidgetLeftWithIcon(
			this,
			0,
			0,
			initialState.donationWidget,
			DONATION_WIDGET_LEFT
		)

		const donationWidgetFullFilled = new DonationWidgetFullFilled(
			this,
			0,
			0,
			initialState.donationWidget,
			DONATION_WIDGET_FULLFILLED,
			[]
		)
		const donationWidgetWishHeading = new DonationWidgetWishHeading(
			this,
			0,
			0,
			initialState.donationWidget,
			'Herzenswunsch'
		)
		const donationWidgetWishSubHeading = new DonationWidgetWishSubHeading(
			this,
			0,
			0,
			initialState.donationWidget,
			'Make-A-Wish'
		)

		const donationWidgetWishTopDonationStatic = new DonationWidgetWishTopDonationStatic(
			this,
			0,
			0,
			initialState.donationWidget,
			'TOP DONATION'
		)

		const donationWidgetWishLastDonationStatic = new DonationWidgetWishLastDonationStatic(
			this,
			0,
			0,
			initialState.donationWidget,
			'LAST DONATION'
		)

		const donationWidgetWishLastDonation = new DonationWidgetWishLastDonation(
			this,
			0,
			0,
			initialState.donationWidget,
			'DEIN NAME'
		)

		const donationWidgetWishTopDonation = new DonationWidgetWishTopDonation(
			this,
			0,
			0,
			initialState.donationWidget,
			'DEIN NAME'
		)

		const progressBarBackground = new DonationWidgetProgressBar(
			this,
			0,
			0,
			initialState.donationWidget,
			donationWidgetProgressBarBackgroundName,
			0x2b067a
		)
		const progressBar = new DonationWidgetProgressBar(
			this,
			0,
			0,
			initialState.donationWidget,
			donationWidgetProgressBarName,
			0xc03be4
		)

		const donationWidgetProgressBarText = new DonationWidgetProgressBarText(
			this,
			0,
			0,
			initialState.donationWidget,
			'Placeholder'
		)

		const donationWidgetPrefixTextStatic = new DonationWidgetPrefixTextStatic(
			this,
			0,
			0,
			initialState.donationWidget,
			'WUNSCH'
		)

		const donationWidgetMiddleTextStatic = new DonationWidgetMiddleTextStatic(
			this,
			0,
			0,
			initialState.donationWidget,
			'ERFÜLLT'
		)

		const donationWidgetPostfixTextStatic = new DonationWidgetPostfixTextStatic(
			this,
			0,
			0,
			initialState.donationWidget,
			'FÜR'
		)

		const donationWidgetWishFullFilledKidName = new DonationWidgetWishFullFilledKidName(
			this,
			0,
			0,
			initialState.donationWidget,
			'NAME'
		)

		const donationWidgetWishFullFilledAmount = new DonationWidgetWishFullFilledAmount(
			this,
			0,
			0,
			initialState.donationWidget,
			'000,00 €'
		)

		const donationWidgetIcon = new DonationWidgetLogo(this, 0, 0, initialState.donationWidget)

		const donationWidgetLoaderFrame = new DonationWidgetLoaderFrame(this, 0, 0, initialState.donationWidget)

		const donationWidgetLoaderFrameText = new DonationWidgetLoaderFrameText(this, 0, 0, '', initialState.donationWidget)

		this.donationWidgetContainer = new DonationWidgetContainer(this, initialState.donationWidget, socket, {
			children: [
				progressBarBackground,
				progressBar,
				donationWidgetBackgroundFrame,
				donationWidgetLeftWithIcon,
				donationWidgetFullFilled,
				donationWidgetPrefixTextStatic,
				donationWidgetMiddleTextStatic,
				donationWidgetPostfixTextStatic,
				donationWidgetWishFullFilledKidName,
				donationWidgetWishFullFilledAmount,
				donationWidgetWishHeading,
				donationWidgetWishSubHeading,
				donationWidgetWishTopDonation,
				donationWidgetWishTopDonationStatic,
				donationWidgetWishLastDonationStatic,
				donationWidgetWishLastDonation,
				donationWidgetProgressBarText,
				donationWidgetIcon,
				donationWidgetLoaderFrame,
				donationWidgetLoaderFrameText,
			],
		})

		const donationGoalProgressbarBackground = new DonationGoalProgressbar(
			this,
			0,
			0,
			initialState.donationGoal,
			donationGoalProgressBackgroundBarName,
			0x2b067a
		)

		const donationGoalProgressbar = new DonationGoalProgressbar(
			this,
			0,
			0,
			initialState.donationGoal,
			donationGoalProgressBarName,
			0xc03be4
		)

		const donationGoalProgressBarText = new SairaCondensedText(
			this,
			0,
			0,
			initialState.donationGoal,
			'Placeholder',
			'donatioGoalProgressBarText'
		)

		const donationGoalProgressBarTitleText = new LuckiestGuyText(
			this,
			0,
			0,
			initialState.donationGoal,
			`${(socket.auth as SocketAuth).channel} für Make-A-Wish`,
			'donationGoalProgressBarTitleText'
		)

		const donationGoalProgressBarHashTagText = new LuckiestGuyText(
			this,
			0,
			0,
			initialState.donationGoal,
			'#charityroyale24',
			'donationGoalProgressBarHashTagText',
			{ fontSize: '14px' }
		)

		this.donationGoalContainer = new DonationGoalContainer(this, initialState.donationGoal, socket, {
			children: [
				donationGoalProgressbarBackground,
				donationGoalProgressbar,
				donationGoalProgressBarText,
				donationGoalProgressBarTitleText,
				donationGoalProgressBarHashTagText,
			],
		})

		this.donationChallengeContainer = new DonationChallengeContainer(this, initialState.donationChallengeWidget, socket)

		this.setContainerDraggable(this.donationWidgetContainer)
		this.setContainerDraggable(this.donationGoalContainer)
		this.setContainerDraggable(this.donationBannerContainer)
		this.setContainerDraggable(this.donationChallengeContainer)

		// global world env objects and settings
		this.sound.pauseOnBlur = false

		socket.emit(REQUEST_STATE)
		socket.emit(REQUEST_MAW_INFO_JSON_DATA)
	}

	private setContainerDraggable(container: Phaser.GameObjects.Container) {
		this.input.setDraggable(container)
		this.input.on(
			'drag',
			(
				_pointer: Phaser.Input.Pointer,
				gameObjectContainer: Phaser.GameObjects.Container,
				dragX: number,
				dragY: number
			) => {
				if (gameObjectContainer.name === container.name && !this.isLockedOverlay) {
					gameObjectContainer.x = dragX
					gameObjectContainer.y = dragY
				}
			}
		)
	}

	private createStarRainInstance(starGroup: Phaser.GameObjects.Group) {
		const { height } = this.scale

		const starColliderSprite = new Phaser.Physics.Arcade.Sprite(this, 960, height + 40, blueStarKey)
		const physicsBody = new Physics.Arcade.Body(this.physics.world, starColliderSprite)
		physicsBody.setSize(2120, 100)
		physicsBody.allowGravity = false
		physicsBody.immovable = true
		starColliderSprite.body = physicsBody

		this.physics.add.existing(starColliderSprite)
		this.physics.world.setBoundsCollision(true, true, false, false)
		this.physics.add.collider(starGroup, starColliderSprite, (gameObject1) => {
			;(gameObject1 as Star).setVelocityX(Phaser.Math.Between(-200, 200))

			if ((gameObject1 as Star).bumps >= 1) {
				;(gameObject1 as Star).starEmitter.killAll()
				;(gameObject1 as Star).starEmitter.destroy(true)
				;(gameObject1 as Star).destroy(true)
			} else {
				;(gameObject1 as Star).bumps += 1
			}
		})
	}
}
