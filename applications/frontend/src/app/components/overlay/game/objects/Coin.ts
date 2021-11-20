import { Physics } from 'phaser'

export class Coin extends Phaser.GameObjects.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture) {
		super(scene, x, y, texture)
		this.name = 'coin'

		this.scene.tweens.add({
			targets: this,
			props: {
				scale: 0.3,
			},
			delay: 5000,
			duration: 500,
			onComplete: () => {
				const body = this.body as Physics.Arcade.Body
				body.allowGravity = true
			},
		})

		const body = new Physics.Arcade.Body(this.scene.physics.world, this)
		this.body = body
		this.body.allowGravity = false
		scene.physics.add.existing(this)
	}
}
