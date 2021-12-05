export interface GlobalState {
	character: CharacterState
	donationAlert: DonationAlertState
	settings: SettingsState
}

export interface SettingsState {
	volume: number
}

export interface DonationAlertState {
	isVisible: boolean
	scale: number
	position: {
		x: number
		y: number
	}
}

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
	message: string
	streamer: string
	timestamp: number
}

export interface UserEntry {
	streamer: string
	channel: string
}

export const CHARACTER_UPDATE = 'characterUpdate'
export const DONATION_ALERT_UPDATE = 'donationAlertUpdate'
export const SETTINGS_UPDATE = 'settingsUpdate'
export const STATE_UPDATE = 'stateUpdate'
export const REQUEST_STATE = 'requestState'
export const DONATION_TRIGGER = 'donationTrigger'
export interface PFTPSocketEventsMap {
	[CHARACTER_UPDATE]: (characterUpdate: Partial<CharacterState>) => void
	[DONATION_ALERT_UPDATE]: (donationAlertUpdate: Partial<DonationAlertState>) => void
	[SETTINGS_UPDATE]: (settingsUpdate: Partial<SettingsState>) => void
	[STATE_UPDATE]: (state: GlobalState) => void
	[REQUEST_STATE]: () => void
	[DONATION_TRIGGER]: (donation: Donation) => void
}

export interface SocketJwtPayload {
	channel: string
	mode: 'read' | 'readwrite'
}
