import { GameObjects, Scene } from 'phaser'

const fadeInDuration = 650
export const fadeIn = (scene: Scene, target: GameObjects.GameObject) => {
	scene.tweens.add({
		targets: target,
		props: {
			alpha: 1,
		},
		duration: fadeInDuration,
	})
}
