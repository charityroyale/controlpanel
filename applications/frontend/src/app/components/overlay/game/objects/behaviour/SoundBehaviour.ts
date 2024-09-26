import { Donation } from '@cp/common'
import { DONATION_ALERT_CLICK_NOICE_AUDIO_KEY, DONATION_ALERT_YEY_AUDIO_KEY } from '../config/sound'

export class SoundBehaviour {
	private scene: Phaser.Scene

	constructor(scene: Phaser.Scene) {
		this.scene = scene
	}

	public playSound(donation: Donation) {
		const { amount_net, amount } = donation

		if (!amount_net || !amount) {
			return
		}

		const amountNetEuro = amount_net / 100
		const amountEuro = amount / 100

		if (amountNetEuro === 13.37 || amountNetEuro === 420 || amountNetEuro === 69) {
			this.scene.sound.play(DONATION_ALERT_CLICK_NOICE_AUDIO_KEY)
		} else if ((amountNetEuro && amountNetEuro < 100) || (amountEuro && amountEuro < 100)) {
			this.scene.sound.play(DONATION_ALERT_YEY_AUDIO_KEY)
		}
	}
}
