import Phaser from 'phaser'
import { gameConfig, SCENES } from './gameConfig'

export class ProjectFeedThePigGame extends Phaser.Game {
	constructor(height: number, width: number) {
		super({ ...gameConfig, scale: { ...gameConfig.scale, height, width } })
		this.scene.start(SCENES.OVERLAY)
	}
}
