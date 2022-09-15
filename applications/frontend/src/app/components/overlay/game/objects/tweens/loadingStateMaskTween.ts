import { GameObjects, Scene } from 'phaser'

const duration = 2000
export const loadingStateMaskTween = (scene: Scene, target: GameObjects.GameObject) => {
	scene.tweens.add({
		targets: target,
		props: {
			x: 200,
			ease: 'Phaser.Math.Easing.Sine.in',
		},
		duration: duration,
		onComplete: () => {
			scene.tweens.add({
				delay: 3000,
				targets: target,
				props: {
					x: 1500,
					ease: 'Phaser.Math.Easing.Sine.in',
				},
				duration: duration,
			})
		},
	})
}
