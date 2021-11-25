import { GameObjects, Scene } from 'phaser'

const scaleOutDuration = 500
const scaleOutDelay = 8000
export const scaleOut = (scene: Scene, target: GameObjects.GameObject, scale: number, onStart: () => void) => {
	scene.tweens.add({
		targets: target,
		props: {
			scale,
		},
		delay: scaleOutDelay,
		duration: scaleOutDuration,
		onStart,
	})
}
