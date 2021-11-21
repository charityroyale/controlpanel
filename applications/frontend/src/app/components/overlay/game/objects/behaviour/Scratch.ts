import { pigIdleKey, pigScratchKey } from '../../scenes/OverlayScene'
import { Pig } from '../Pig'
import { PigBehaviour } from './Behaviour'

export class Scratch implements PigBehaviour {
	private character: Pig

	private scratchTimer = 20000
	private scratchTimerId: undefined | number = undefined

	constructor(character: Pig) {
		this.character = character
	}

	public start() {
		this.scratchTimerId = window.setInterval(() => {
			if (this.character.anims.currentAnim.key === pigIdleKey) {
				this.character.anims.stopAfterRepeat(1)
				this.character.play(pigScratchKey).chain(pigIdleKey)
			}
		}, this.scratchTimer)
	}

	public stop() {
		window.clearInterval(this.scratchTimerId)
		this.scratchTimerId = undefined
	}

	public reset() {
		this.stop()
		this.start()
	}
}
