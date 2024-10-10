import { blueStarKey } from '../../../scenes/OverlayScene'
import { FIREWORKS_SOUND_1_AUDIO_KEY, FIREWORKS_SOUND_2_AUDIO_KEY } from '../../config/sound'
import { Alert } from '../../containers/alert/Alert'

// Inspired by https://codepen.io/samme/pen/eYEearb @sammee on github
const fireworksEmitterConfig: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
	alpha: { start: 1, end: 0, ease: 'Cubic.easeIn' },
	angle: { start: 0, end: 360, steps: 100 },
	frequency: 1000,
	gravityY: 600,
	lifespan: 1800,
	quantity: 500,
	reserve: 500,
	scale: { min: 0.02, max: 0.35 },
	speed: { min: 200, max: 600 },
	emitting: false,
}

export const playFireWork = (alert: Alert) => {
	const { width, height } = alert.scene.scale
	alert.scene.time.addEvent({
		repeat: 4,
		delay: 1500,
		startAt: 100,
		callback: () => {
			const fireworksEmitter = alert.scene.add.particles(0, 0, blueStarKey, fireworksEmitterConfig)
			fireworksEmitter.setPosition(
				width * Phaser.Math.FloatBetween(0.2, 0.8),
				height * Phaser.Math.FloatBetween(0, 0.2)
			)
			fireworksEmitter.explode()
			alert.scene.sound.play(Phaser.Math.Between(0, 1) > 0 ? FIREWORKS_SOUND_1_AUDIO_KEY : FIREWORKS_SOUND_2_AUDIO_KEY)
		},
	})
}
