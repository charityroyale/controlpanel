import Phaser from 'phaser'

interface PigProps {
	texture: string
	x: number
	y: number
}

export class Pig extends Phaser.GameObjects.Image {
	constructor(scene: Phaser.Scene, options: PigProps) {
		super(scene, options.x, options.y, options.texture)
		this.setName('pig')
		this.setScale(0.5)
		scene.add.existing(this)
	}
}
