import { pigIdleKey } from '../../scenes/OverlayScene'
import { Pig, PigAnimationKeys } from '../Pig'
import { PigBehaviour } from './Behaviour'

export class Sleep implements PigBehaviour {
	private character: Pig

	private sleepTimer = 5000
	private sleepTimerId: undefined | number = undefined

	constructor(character: Pig) {
		this.character = character
	}

	public startInterval() {
		this.sleepTimerId = window.setInterval(() => {
			console.log(this.character.anims.currentAnim.key)
			if (this.character.anims.currentAnim.key === PigAnimationKeys.idle) {
				this.character.play(PigAnimationKeys.scratch).on('animationcomplete', () => {
					this.character.play(pigIdleKey)
				})
			}
		}, this.sleepTimer)
	}

	public stopInterval() {
		window.clearInterval(this.sleepTimerId)
		this.sleepTimerId = undefined
	}
}
