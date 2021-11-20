import { Physics } from 'phaser'

const defaultStyles = {
	fontFamily: 'Roboto',
	fontSize: '30px',
	color: ' #BA4D76',
	align: 'center',
}

export class CoinTextAmount extends Phaser.GameObjects.Text {
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		text: string | string[],
		style: Phaser.Types.GameObjects.Text.TextStyle = defaultStyles
	) {
		super(scene, x, y, text, style)
		this.name = 'cointext'
		this.setOrigin(0.5)

		this.alpha = 0

		this.scene.tweens.add({
			targets: this,
			props: {
				alpha: 1,
			},
			duration: 650,
		})

		this.scene.tweens.add({
			targets: this,
			props: {
				scale: 0,
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
