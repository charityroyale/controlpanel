import { GameObjects, Scene } from 'phaser'

const fadeInDuration = 350
export const fadeInDonationText = (scene: Scene, target: GameObjects.GameObject) => {
	scene.tweens.add({
		targets: target,
		props: {
			alpha: 1,
		},
		delay: 550,
		duration: fadeInDuration,
	})
}
