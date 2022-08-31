import { DonationAlertState, SettingsState } from '@pftp/common'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialSettingsState: SettingsState = {
	volume: 0.6,
	isLockedOverlay: false,
}
const settingsSlice = createSlice({
	name: 'settings',
	initialState: initialSettingsState,
	reducers: {
		update: (state, action: PayloadAction<Partial<SettingsState>>) => {
			return {
				...state,
				...action.payload,
			}
		},
	},
})

const initialDonationAlertState: DonationAlertState = {
	isVisible: true,
	scale: 0.84,
	position: {
		x: 1920 / 2,
		y: 111,
	},
	text2speech: {
		volume: 0.5,
		language: 'de-AT',
	},
}
const donationAlertSlice = createSlice({
	name: 'donationalert',
	initialState: initialDonationAlertState,
	reducers: {
		update: (state, action: PayloadAction<Partial<DonationAlertState>>) => {
			return {
				...state,
				...action.payload,
			}
		},
	},
})

export const donationAlertReducer = donationAlertSlice.reducer
export const updateDonationAlert = donationAlertSlice.actions.update

export const settingsReducer = settingsSlice.reducer
export const updateSettings = settingsSlice.actions.update
