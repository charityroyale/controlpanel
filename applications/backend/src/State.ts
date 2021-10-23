import { CharacterState } from '@pftp/common'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialCharacterState: CharacterState = {
	isVisible: true,
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
