export class CoinTextDonatorWithMessageBackground extends Phaser.GameObjects.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
		super(scene, x, y, texture)
		this.name = 'cointextdonatorwithmessagebackground'
		this.setOrigin(0)
		this.setDisplaySize(400, 225)
		this.alpha = 0

		this.scene.tweens.add({
			targets: this,
			props: {
				alpha: 1,
			},
			duration: 500,
		})

		this.scene.tweens.add({
			targets: this,
			props: {
				alpha: 0,
			},
			delay: 5000,
			duration: 500,
			onComplete: () => {
				this.destroy()
			},
		})

		scene.add.existing(this)
	}
}
