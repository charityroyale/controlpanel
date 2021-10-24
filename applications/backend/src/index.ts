import { configureStore } from '@reduxjs/toolkit'
import { logger } from './logger'
import { CHARACTER_UPDATE, GlobalState, PFTPSocketEventsMap, REQUEST_STATE, STATE_UPDATE } from '@pftp/common'
import { characterReducer, updateCharacter } from './State'
import { createServer } from 'http'
import { Server } from 'socket.io'

const store = configureStore<GlobalState>({
	reducer: {
		character: characterReducer,
	},
})

const httpServer = createServer()
const io = new Server<PFTPSocketEventsMap>(httpServer, {})

io.on('connection', (socket) => {
	logger.info(`new connection from ${socket.id}!`)

	socket.on(CHARACTER_UPDATE, (characterUpdate) => store.dispatch(updateCharacter(characterUpdate)))
	socket.on('disconnect', (reason) => {
		logger.info(`socket ${socket.id} disconnected with reason: ${reason}`)
	})

	socket.emit(STATE_UPDATE, store.getState())
	socket.on(REQUEST_STATE, () => socket.emit(STATE_UPDATE, store.getState()))
})

store.subscribe(() => {
	io.emit(STATE_UPDATE, store.getState())
	console.log(store.getState())
})

const port = process.env.PORT_BACKEND ?? 5200
httpServer.listen(port)
logger.info(`Backend ready on port ${port}`)
