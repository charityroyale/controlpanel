import { Physics } from 'phaser'
import { fadeIn } from './tweens/fadeIn'
import { scaleOut } from './tweens/scaleOut'

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
		this.body = new Physics.Arcade.Body(this.scene.physics.world, this)
		this.body.allowGravity = false

		fadeIn(scene, this)
		scaleOut(scene, this, () => {
			const body = this.body as Physics.Arcade.Body
			body.allowGravity = true
		})

		scene.physics.add.existing(this)
	}
}
