import { Donation } from '@cp/common'
import {
	DEFAULT_DONATION_ALERT_AUDIO_KEY,
	DONATION_ALERT_COIN_0_AUDIO_KEY,
	DONATION_ALERT_COIN_1_AUDIO_KEY,
	DONATION_ALERT_DRUM_ROLL_AUDIO_KEY,
	DONATION_ALERT_MAGICAL_HARP_AUDIO_KEY,
	DONATION_ALERT_POWER_UP_AUDIO_KEY,
	DONATION_ALERT_SPECIAL_NANI_AUDIO_KEY,
	DONATION_ALERT_SPECIAL_SMOKE_WEED_AUDIO_KEY,
	DONATION_ALERT_SPECIAL_YOU_GOT_THAT_SOMETHING_AUDIO_KEY,
	DONATION_ALERT_YOU_WIN_0_AUDIO_KEY,
	DONATION_ALERT_YOU_WIN_EPIC_AUDIO_KEY,
} from '../config/sound'

export class SoundBehaviour {
	private scene: Phaser.Scene

	constructor(scene: Phaser.Scene) {
		this.scene = scene
	}

	public playSound(donation: Donation) {
		const { net_amount } = donation

		if (net_amount === 13.37) {
			this.scene.sound.play(DONATION_ALERT_SPECIAL_NANI_AUDIO_KEY)
		} else if (net_amount === 69) {
			this.scene.sound.play(DONATION_ALERT_SPECIAL_YOU_GOT_THAT_SOMETHING_AUDIO_KEY)
		} else if (net_amount === 420) {
			this.scene.sound.play(DONATION_ALERT_SPECIAL_SMOKE_WEED_AUDIO_KEY)
		} else if (net_amount < 5) {
			this.scene.sound.play(DONATION_ALERT_COIN_0_AUDIO_KEY)
		} else if (net_amount < 10) {
			this.scene.sound.play(DEFAULT_DONATION_ALERT_AUDIO_KEY)
		} else if (net_amount < 50) {
			this.scene.sound.play(DONATION_ALERT_COIN_1_AUDIO_KEY)
		} else if (net_amount < 100) {
			this.scene.sound.play(DONATION_ALERT_YOU_WIN_0_AUDIO_KEY)
		} else if (net_amount < 250) {
			this.scene.sound.play(DONATION_ALERT_POWER_UP_AUDIO_KEY)
		} else if (net_amount < 500) {
			this.scene.sound.play(DONATION_ALERT_MAGICAL_HARP_AUDIO_KEY)
		} else if (net_amount < 1000) {
			this.scene.sound.play(DONATION_ALERT_DRUM_ROLL_AUDIO_KEY)
		} else {
			this.scene.sound.play(DONATION_ALERT_YOU_WIN_EPIC_AUDIO_KEY)
		}
	}
}
