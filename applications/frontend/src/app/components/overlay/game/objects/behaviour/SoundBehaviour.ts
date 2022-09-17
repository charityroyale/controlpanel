import { Donation } from '@cp/common'
import {
	DEFAULT_DONATION_ALERT_AUDIO_KEY,
	DONATION_ALERT_COIN_0_AUDIO_KEY,
	DONATION_ALERT_COIN_1_AUDIO_KEY,
	DONATION_ALERT_DRUM_ROLL_AUDIO_KEY,
	DONATION_ALERT_MAGICAL_HARP_AUDIO_KEY,
	DONATION_ALERT_POWER_UP_AUDIO_KEY,
	DONATION_ALERT_YOU_WIN_0_AUDIO_KEY,
	DONATION_ALERT_YOU_WIN_EPIC_AUDIO_KEY,
} from '../config/sound'

export class SoundBehaviour {
	private scene: Phaser.Scene

	constructor(scene: Phaser.Scene) {
		this.scene = scene
	}

	public playSound(donation: Donation) {
		const { amount } = donation

		if (amount < 5) {
			this.scene.sound.play(DONATION_ALERT_COIN_0_AUDIO_KEY)
		} else if (amount < 10) {
			this.scene.sound.play(DEFAULT_DONATION_ALERT_AUDIO_KEY)
		} else if (amount < 50) {
			this.scene.sound.play(DONATION_ALERT_COIN_1_AUDIO_KEY)
		} else if (amount < 100) {
			this.scene.sound.play(DONATION_ALERT_YOU_WIN_0_AUDIO_KEY)
		} else if (amount < 250) {
			this.scene.sound.play(DONATION_ALERT_POWER_UP_AUDIO_KEY)
		} else if (amount < 500) {
			this.scene.sound.play(DONATION_ALERT_MAGICAL_HARP_AUDIO_KEY)
		} else if (amount < 1000) {
			this.scene.sound.play(DONATION_ALERT_DRUM_ROLL_AUDIO_KEY)
		} else {
			this.scene.sound.play(DONATION_ALERT_YOU_WIN_EPIC_AUDIO_KEY)
		}
	}
}
