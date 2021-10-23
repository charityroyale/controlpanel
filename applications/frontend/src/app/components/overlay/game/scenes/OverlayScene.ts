import Phaser from 'phaser'
import { SCENES } from '../gameConfig'
import { Pig } from '../objects/Pig'

const PIG_PLACEHOLDER_SPRITESHEET_KEY = 'pigPlaceHolder'
export class OverlayScene extends Phaser.Scene {
	constructor() {
		super({ key: SCENES.OVERLAY })
	}

	init() {
		console.log('init')
	}

	preload() {
		this.load.spritesheet(PIG_PLACEHOLDER_SPRITESHEET_KEY, '/pig_placeholder.png', {
			frameWidth: 225,
			frameHeight: 225,
		})
	}

	create() {
		new Pig(this, { x: 300, y: 300, texture: PIG_PLACEHOLDER_SPRITESHEET_KEY })
	}
}
