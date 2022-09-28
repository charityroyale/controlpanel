import { Donation } from '@cp/common'
import { DONATION_ALERT_CLICK_NOICE_AUDIO_KEY, DONATION_ALERT_YEY_AUDIO_KEY } from '../config/sound'

export class SoundBehaviour {
	private scene: Phaser.Scene

	constructor(scene: Phaser.Scene) {
		this.scene = scene
	}

	public playSound(donation: Donation) {
		const { amount_net } = donation

		if (amount_net === 13.37 || amount_net === 420 || amount_net === 69) {
			this.scene.sound.play(DONATION_ALERT_CLICK_NOICE_AUDIO_KEY)
		} else if (amount_net < 100) {
			this.scene.sound.play(DONATION_ALERT_YEY_AUDIO_KEY)
		}
	}
}
