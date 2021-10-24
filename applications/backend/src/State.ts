import { CharacterState } from '@pftp/common'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialCharacterState: CharacterState = {
	isVisible: true,
	isLocked: false,
	position: {
		x: 1080 / 2,
		y: 1920 / 2,
	},
}
const characterSlice = createSlice({
	name: 'character',
	initialState: initialCharacterState,
	reducers: {
		update: (state, action: PayloadAction<Partial<CharacterState>>) => {
			return {
				...state,
				...action.payload,
			}
		},
	},
})

export const characterReducer = characterSlice.reducer
export const updateCharacter = characterSlice.actions.update
