import { Physics } from 'phaser'

export class Sign extends Phaser.GameObjects.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture) {
		super(scene, x, y, texture)

		this.setScale(0.65)
		const body = new Physics.Arcade.StaticBody(this.scene.physics.world, this)
		this.body = body
		scene.physics.add.existing(this)
	}
}
