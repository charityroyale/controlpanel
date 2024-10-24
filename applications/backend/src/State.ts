import {
	DonationAlertState,
	DonationChallengeState,
	DonationGoalState,
	DonationWidgetState,
	SettingsState,
} from '@cp/common'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { mawApiClient } from './MakeAWishApiClient'

const initialSettingsState: SettingsState = {
	volume: 0.6,
	isLockedOverlay: false,
	text2speech: {
		volume: 0.4,
		minDonationAmount: 10,
		language: '0',
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

const initialDonationGoalState: DonationGoalState = {
	isVisible: true,
	scale: 1.37,
	data: {
		current: 9800,
		goal: 420,
	},
	position: {
		x: 417,
		y: 1008,
	},
}
const donationGoalSlice = createSlice({
	name: 'donationgoal',
	initialState: initialDonationGoalState,
	reducers: {
		update: (state, action: PayloadAction<Partial<DonationGoalState>>) => {
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
	scale: 1.08,
	position: {
		x: 1564,
		y: 849,
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

const initialDonationChallengeWidgetState: DonationChallengeState = {
	isVisible: false,
	scale: 1.3,
	data: {
		current: 0,
		goal: 69,
	},
	position: {
		x: 378,
		y: 55,
	},
}
const donationChallengeWidgetSlice = createSlice({
	name: 'donationchallenge',
	initialState: initialDonationChallengeWidgetState,
	reducers: {
		update: (state, action: PayloadAction<Partial<DonationChallengeState>>) => {
			return {
				...state,
				...action.payload,
			}
		},
	},
})

export const donationAlertReducer = donationAlertSlice.reducer
export const updateDonationAlert = donationAlertSlice.actions.update

export const donationGoalReducer = donationGoalSlice.reducer
export const updateDonationGoal = donationGoalSlice.actions.update

export const donationChallengeWidgetReducer = donationChallengeWidgetSlice.reducer
export const updateDonationCHallengeWidget = donationChallengeWidgetSlice.actions.update

export const donationWidgetReducer = donationWidgetSlice.reducer
export const updateDonationWidget = donationWidgetSlice.actions.update

export const settingsReducer = settingsSlice.reducer
export const updateSettings = settingsSlice.actions.update
