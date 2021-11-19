import { Physics } from 'phaser'
import { pigDonationOutKey, pigIdleKey } from '../scenes/OverlayScene'
import { Pig } from './Pig'

export class Coin extends Phaser.GameObjects.Sprite {
	private container
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		texture: string | Phaser.Textures.Texture,
		container: Phaser.GameObjects.Container
	) {
		super(scene, x, y, texture)
		this.name = 'coin'
		this.container = container
		this.setScale(1)

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
		console.log(this.scale)
		this.addMouthCollider()
		scene.physics.add.existing(this)
	}

	public addMouthCollider() {
		const collider = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'not-needed')
		const body = new Physics.Arcade.Body(this.scene.physics.world, collider)
		collider.body = body
		collider.setVisible(false)
		collider.body.allowGravity = false
		collider.body.setSize(170, 170)
		const target = this.scene.physics.add.existing(collider)
		this.container.add(collider)

		this.scene.physics.add.overlap(
			this,
			target,
			(currentGameObject) => {
				currentGameObject.destroy()
				collider.destroy()
				body.destroy()
				target.destroy()
				const pig = this.container.getByName('pig') as Pig
				pig.play(pigDonationOutKey).chain(pigIdleKey)
			},
			undefined,
			this
		)
	}
}
