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

		this.setInteractive()
		scene.input.setDraggable(this)
		this.on('pointerout', () => {
			console.log('Pig position updated.')
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		scene.input.on('drag', (_pointer: any, _gameObject: any, dragX: any, dragY: any) => {
			this.x = dragX
			this.y = dragY
		})
	}
}
