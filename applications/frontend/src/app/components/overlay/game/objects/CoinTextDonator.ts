import { Physics } from 'phaser'

const defaultStyles = {
	fontFamily: 'Roboto',
	fontSize: '24px',
	color: '#41291C',
	wordWrap: { width: 400 - 40 },
}

export class CoinTextDonator extends Phaser.GameObjects.Text {
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		text: string | string[],
		style: Phaser.Types.GameObjects.Text.TextStyle = defaultStyles
	) {
		super(scene, x, y, text, style)
		this.name = 'cointext'
		this.setStroke('#41291C', 1)
		this.setOrigin(0, 0.5)

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

		const body = new Physics.Arcade.Body(this.scene.physics.world, this)
		this.body = body
		this.body.allowGravity = false
		scene.physics.add.existing(this)
	}
}
