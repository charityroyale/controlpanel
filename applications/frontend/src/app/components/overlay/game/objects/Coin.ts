import { Physics } from 'phaser'
import { fadeIn } from './tweens/fadeIn'
import { scaleOut } from './tweens/scaleOut'

export class Coin extends Phaser.GameObjects.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture) {
		super(scene, x, y, texture)
		this.name = 'coin'
		this.setScale(0.4)
		this.alpha = 0
		this.body = new Physics.Arcade.Body(this.scene.physics.world, this)
		this.body.allowGravity = false

		fadeIn(scene, this)
		scaleOut(scene, this, 0.1, () => {
			const body = this.body as Physics.Arcade.Body
			body.allowGravity = true
		})

		scene.physics.add.existing(this)
	}
}
