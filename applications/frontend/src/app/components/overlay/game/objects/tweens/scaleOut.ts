import { GameObjects, Scene } from 'phaser'

const scaleOutDuration = 500
const scaleOutDelay = 6000
export const scaleOut = (scene: Scene, target: GameObjects.GameObject, onStart: () => void) => {
	scene.tweens.add({
		targets: target,
		props: {
			scale: 0.3,
		},
		delay: scaleOutDelay,
		duration: scaleOutDuration,
		onStart,
	})
}
