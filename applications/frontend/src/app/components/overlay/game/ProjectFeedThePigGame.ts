import { GlobalState, PFTPSocketEventsMap } from '@pftp/common'
import { Socket } from 'socket.io-client'
import Phaser from 'phaser'
import { gameConfig, SCENES } from './gameConfig'

export class ProjectFeedThePigGame extends Phaser.Game {
	constructor(socket: Socket<PFTPSocketEventsMap>, height: number, width: number, initialState: GlobalState) {
		super({ ...gameConfig, scale: { ...gameConfig.scale, height, width } })
		this.scene.start(SCENES.OVERLAY, { socket, initialState })
	}
}
