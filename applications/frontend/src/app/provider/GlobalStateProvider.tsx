import React, { useCallback, useEffect } from 'react'
import { createContext, FunctionComponent, useState } from 'react'
import { GlobalState, REQUEST_MAW_INFO_JSON_DATA, REQUEST_STATE, STATE_UPDATE } from '@pftp/common'
import { useSocket } from '../hooks/useSocket'

export interface GlobalStateContextState {
	globalState: GlobalState | null
}

const globalStateDefaultValue: GlobalStateContextState = {
	globalState: null,
}

export const GlobalStateContext = createContext<GlobalStateContextState>(globalStateDefaultValue)
export const GlobalStateProvider: FunctionComponent<React.PropsWithChildren<unknown>> = ({ children }) => {
	const [globalState, setGlobalState] = useState<GlobalState | null>(globalStateDefaultValue.globalState)
	const { socket, isConnected } = useSocket()

	const updateGlobalState = useCallback((state: GlobalState) => {
		setGlobalState(state)
	}, [])

	useEffect(() => {
		if (isConnected && socket) {
			socket.on(STATE_UPDATE, updateGlobalState)
			socket.emit(REQUEST_STATE)
			socket.emit(REQUEST_MAW_INFO_JSON_DATA)
		} else if (!isConnected && socket) {
			socket.off(STATE_UPDATE, updateGlobalState)
		}
	}, [socket, updateGlobalState, isConnected])

	return (
		<GlobalStateContext.Provider
			value={{
				globalState,
			}}
		>
			{children}
		</GlobalStateContext.Provider>
	)
}
