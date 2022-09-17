import { DonationAlertState, DonationWidgetState, SettingsState } from '@cp/common'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { mawApiClient } from './MakeAWishApiClient'

const initialSettingsState: SettingsState = {
	volume: 0.6,
	isLockedOverlay: false,
	text2speech: {
		volume: 0.4,
		minDonationAmount: 10,
		language: 'de-AT',
	},
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

const initialDonationWidgetState: DonationWidgetState = {
	isVisible: true,
	scale: 0.84,
	position: {
		x: 1920 / 2,
		y: 400,
	},
	wish: null,
}
const donationWidgetSlice = createSlice({
	name: 'donationwidget',
	initialState: initialDonationWidgetState,
	reducers: {
		update: (state, action: PayloadAction<Partial<DonationWidgetState>>) => {
			const slug = action.payload.wish?.slug ?? state.wish?.slug ?? 'noslug'
			action.payload.wish = {
				slug: slug,
				info: mawApiClient.mawInfoJsonData?.wishes[slug],
			}

			return {
				...state,
				...action.payload,
			}
		},
	},
})

export const donationAlertReducer = donationAlertSlice.reducer
export const updateDonationAlert = donationAlertSlice.actions.update

export const donationWidgetReducer = donationWidgetSlice.reducer
export const updateDonationWidget = donationWidgetSlice.actions.update

export const settingsReducer = settingsSlice.reducer
export const updateSettings = settingsSlice.actions.update
