import React from 'react'
import { useEffect } from 'react'
import { useGlobalState } from '../../hooks/useGlobalState'
import { useIsMounted } from '../../hooks/useIsMounted'
import { useSocket } from '../../hooks/useSocket'
import styled from 'styled-components'
import { ControlPanelGame } from './game/ControlPanelGame'

const PhaserDiv = styled.div`
	width: 100%;
	height: 100%;
`

export const PhaserGame = () => {
	const isMounted = useIsMounted()
	const { socket } = useSocket()
	const { globalState } = useGlobalState()

	useEffect(() => {
		if (isMounted && socket && globalState) {
			new ControlPanelGame(socket, 1080, 1920, globalState)
		}

		// at this point we can be sure that globalState and socketIo connectin are given
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMounted])

	return <PhaserDiv id="controlpanel-overlay" />
}

export default PhaserGame
