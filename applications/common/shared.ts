export interface GlobalState {
	character: CharacterState
	settings: SettingsState
}

export interface SettingsState {
	volume: number
}

export type PigStateType = 'idle' | 'sleep'
export interface CharacterState {
	isVisible: boolean
	isLocked: boolean
	scale: number
	flipX: boolean
	position: {
		x: number
		y: number
	}
}

/**
 * Sync with /donation endpoint
 */
export interface Donation {
	user: string
	amount: number
	timestamp: number
}

export const CHARACTER_UPDATE = 'characterUpdate'
export const SETTINGS_UPDATE = 'settingsUpdate'
export const STATE_UPDATE = 'stateUpdate'
export const REQUEST_STATE = 'requestState'
export const DONATION_TRIGGER = 'donationTrigger'
export interface PFTPSocketEventsMap {
	[CHARACTER_UPDATE]: (characterUpdate: Partial<CharacterState>) => void
	[SETTINGS_UPDATE]: (settingsUpdate: Partial<SettingsState>) => void
	[STATE_UPDATE]: (state: GlobalState) => void
	[REQUEST_STATE]: () => void
	[DONATION_TRIGGER]: (donation: Donation) => void
}
