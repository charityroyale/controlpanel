import React from 'react'
import { useEffect } from 'react'
import { useIsMounted } from '../../hooks/useIsMounted'
import { styled } from '../../styles/Theme'
import { ProjectFeedThePigGame } from './game/ProjectFeedThePigGame'

const PhaserDiv = styled.div`
	width: 100%;
	height: 100%;
`

export const PhaserGame = () => {
	const isMounted = useIsMounted()

	useEffect(() => {
		if (isMounted) {
			new ProjectFeedThePigGame(1080, 1920)
		}
	}, [isMounted])

	return <PhaserDiv id="pftp-overlay" />
}

export default PhaserGame
