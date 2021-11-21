import { fadeIn } from './tweens/fadeIn'
import { fadeOut } from './tweens/fadeOut'

export class CoinTextDonatorWithMessageBackground extends Phaser.GameObjects.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
		super(scene, x, y, texture)
		this.name = 'cointextdonatorwithmessagebackground'
		this.setOrigin(0)
		this.setDisplaySize(400, 225)
		this.alpha = 0

		fadeIn(scene, this)
		fadeOut(scene, this, () => this.destroy())

		scene.add.existing(this)
	}
}
