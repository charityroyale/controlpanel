export class Sign extends Phaser.GameObjects.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture) {
		super(scene, x, y, texture)

		this.setScale(0.75)
		scene.physics.add.existing(this)
	}
}
