import { Scene } from 'phaser'

const durationIn = 1000
const durationOut = 750
export const loadingStateMaskTween = (scene: Scene, target: Phaser.GameObjects.Graphics) => {
	scene.tweens.add({
		targets: target,
		props: {
			x: 0,
			ease: 'Phaser.Math.Easing.Sine.in',
		},
		duration: durationIn,
		onComplete: () => {
			scene.events.emit('swapCurrentWishText')
			scene.tweens.add({
				delay: 7500,
				targets: target,
				props: {
					x: 1920,
					ease: 'Phaser.Math.Easing.Sine.in',
				},
				duration: durationOut,
				onStart: () => {
					scene.events.emit('hidingLoadingState')
				},
				onComplete: () => {
					target.destroy(true)
				},
			})
		},
	})
}
