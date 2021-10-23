export interface GlobalState {
	character: CharacterState
}
export interface CharacterState {
	isVisible: boolean
	position: {
		x: number
		y: number
	}
}

export const CHARACTER_UPDATE = 'characterUpdate'
export const STATE_UPDATE = 'stateUpdate'
export const REQUEST_STATE = 'requestState'
export interface PFTPSocketEventsMap {
	[CHARACTER_UPDATE]: (characterUpdate: Partial<CharacterState>) => void
	[STATE_UPDATE]: (state: GlobalState) => void
	[REQUEST_STATE]: () => void
}
