import { Physics } from 'phaser'
import { fadeIn } from './tweens/fadeIn'
import { fadeOut } from './tweens/fadeOut'

const defaultStyles = {
	fontFamily: 'Roboto',
	fontSize: '24px',
	color: '#41291C',
	wordWrap: { width: 400 - 40 },
	maxLines: 6,
}

export class CoinTextDonatorMessage extends Phaser.GameObjects.Text {
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		text: string | string[],
		style: Phaser.Types.GameObjects.Text.TextStyle = defaultStyles
	) {
		super(scene, x, y, text, style)
		this.name = 'cointext'
		this.setOrigin(0, 0)
		this.alpha = 0
		this.body = new Physics.Arcade.Body(this.scene.physics.world, this)
		this.body.allowGravity = false

		fadeIn(scene, this)
		fadeOut(scene, this, () => this.destroy())

		scene.physics.add.existing(this)
	}
}
