import Phaser from 'phaser'
import { OverlayScene } from './scenes/OverlayScene'
import WebFontLoaderPlugin from 'phaser3-rex-plugins/plugins/webfontloader-plugin.js'

export const gameConfig = {
	type: Phaser.AUTO,
	transparent: true,
	scale: {
		parent: 'controlpanel-overlay',
		width: 1920,
		height: 1080,
		autoCenter: Phaser.Scale.NONE,
	},
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
			enabled: true,
			gravity: { y: 1000 },
			showBody: true,
			showStaticBody: true,
			debugBodyColor: 0xff00ff,
		},
	},
	scene: [OverlayScene],
	plugins: {
		global: [
			{
				key: 'rexWebFontLoader',
				plugin: WebFontLoaderPlugin,
				start: true,
			},
		],
	},
}

export const SCENES = {
	OVERLAY: 'OverlayScene',
}
