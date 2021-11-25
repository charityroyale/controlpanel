import { GameObjects, Scene } from 'phaser'

const fadeInDuration = 350
export const fadeInDonationMessageText = (scene: Scene, target: GameObjects.GameObject) => {
	scene.tweens.add({
		targets: target,
		props: {
			alpha: 1,
		},
		delay: 1550,
		duration: fadeInDuration,
	})
}
