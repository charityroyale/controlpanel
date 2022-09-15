import { Scene } from 'phaser'

const duration = 2000
export const loadingStateMaskTween = (scene: Scene, target: Phaser.GameObjects.Graphics) => {
	scene.tweens.add({
		targets: target,
		props: {
			x: 0,
			ease: 'Phaser.Math.Easing.Sine.in',
		},
		duration: duration,
		onComplete: () => {
			scene.events.emit('swapCurrentWishText')
			scene.tweens.add({
				delay: 3000,
				targets: target,
				props: {
					x: 1920,
					ease: 'Phaser.Math.Easing.Sine.in',
				},
				duration: duration,
				onComplete: () => {
					target.destroy()
				},
			})
		},
	})
}
