import { pigIdleKey, pigSleepInKey, pigSleepKey } from '../../scenes/OverlayScene'
import { Pig } from '../containers/pig/Pig'
import { PigBehaviour } from './Behaviour'

export class Sleep implements PigBehaviour {
	private character: Pig

	private sleepTimer = 900000 // 15 minutes
	private sleepTimerId: undefined | number = undefined

	constructor(character: Pig) {
		this.character = character
	}

	public start() {
		this.sleepTimerId = window.setInterval(() => {
			if (this.character.anims.currentAnim.key === pigIdleKey) {
				this.character.anims.stopAfterRepeat(1)
				this.character.play(pigSleepInKey).chain(pigSleepKey)
			}
		}, this.sleepTimer)
	}

	public stop() {
		window.clearInterval(this.sleepTimerId)
		this.sleepTimerId = undefined
	}

	public reset() {
		this.stop()
		this.start()
	}
}
