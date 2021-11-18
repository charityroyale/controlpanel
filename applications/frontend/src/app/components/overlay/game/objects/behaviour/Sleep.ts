import { pigIdleKey, pigSleepInKey, pigSleepKey } from '../../scenes/OverlayScene'
import { Pig } from '../Pig'
import { PigBehaviour } from './Behaviour'

export class Sleep implements PigBehaviour {
	private character: Pig

	private sleepTimer = 2000
	private sleepTimerId: undefined | number = undefined

	constructor(character: Pig) {
		this.character = character
	}

	public start() {
		this.sleepTimerId = window.setTimeout(() => {
			if (this.character.anims.currentAnim.key === pigIdleKey) {
				console.log('trying to sleep')
				this.character.play(pigSleepInKey).chain(pigSleepKey)
			}
		}, this.sleepTimer)
	}

	public stop() {
		window.clearTimeout(this.sleepTimerId)
		this.sleepTimerId = undefined
	}

	public reset() {
		this.stop()
		this.start()
	}
}
