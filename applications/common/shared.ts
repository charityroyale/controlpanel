export interface GlobalState {
	character: CharacterState
}
export interface CharacterState {
	isVisible: boolean
	isLocked: boolean
	position: {
		x: number
		y: number
	}
}

export interface Donation {
	user: string
	amount: number
	timestamp: Date
}

export const CHARACTER_UPDATE = 'characterUpdate'
export const STATE_UPDATE = 'stateUpdate'
export const REQUEST_STATE = 'requestState'
export const DONATION_TRIGGER = 'donationTrigger'
export interface PFTPSocketEventsMap {
	[CHARACTER_UPDATE]: (characterUpdate: Partial<CharacterState>) => void
	[STATE_UPDATE]: (state: GlobalState) => void
	[REQUEST_STATE]: () => void
	[DONATION_TRIGGER]: (donation: Donation) => void
}
