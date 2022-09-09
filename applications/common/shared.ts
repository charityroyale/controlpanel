export interface GlobalState {
	donationAlert: DonationAlertState
	settings: SettingsState
}

export interface SettingsState {
	volume: number
	isLockedOverlay: boolean
	text2speech: {
		volume: number
		minDonationAmount: number
		language: string
	}
}

export interface DonationAlertState {
	isVisible: boolean
	scale: number
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

export const DONATION_ALERT_UPDATE = 'donationAlertUpdate'
export const SETTINGS_UPDATE = 'settingsUpdate'
export const STATE_UPDATE = 'stateUpdate'
export const REQUEST_STATE = 'requestState'
export const DONATION_TRIGGER = 'donationTrigger'
export interface PFTPSocketEventsMap {
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
