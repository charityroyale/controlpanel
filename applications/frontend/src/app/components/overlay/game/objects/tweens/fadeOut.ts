import { GameObjects, Scene } from 'phaser'

const fadeOutDuration = 500
const fadeOutDelay = 5000
export const fadeOut = (scene: Scene, target: GameObjects.GameObject, onComplete: () => void) => {
	scene.tweens.add({
		targets: target,
		props: {
			alpha: 0,
		},
		duration: fadeOutDuration,
		delay: fadeOutDelay,
		onComplete,
	})
}
