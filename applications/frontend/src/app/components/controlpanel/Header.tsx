import React from 'react'
import { FunctionComponent } from 'react'
import { styled } from '../../styles/Theme'

export const Header: FunctionComponent = () => {
	return (
		<GridHeader>
			<Logo src="/charity_royale_logo.png" alt="Charity Royale logo" height="36px" />
			<Heading>PROJECT: Feed the Pig</Heading>
		</GridHeader>
	)
}

const GridHeader = styled.div`
	background-color: ${(p) => p.theme.color.background};
	grid-area: header;
	display: flex;
	align-items: center;
	padding: ${(p) => p.theme.space.xs}px ${(p) => p.theme.space.s}px;
`

const Logo = styled.img`
	margin-right: ${(p) => p.theme.space.m}px;
`

const Heading = styled.h1`
	font-size: ${(p) => p.theme.fontSize.l}px;
`
