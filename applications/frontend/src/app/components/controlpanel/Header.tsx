import React from 'react'
import { FunctionComponent } from 'react'
import { UserDTO } from '../../../pages/api/sessions'
import { styled } from '../../styles/Theme'

export const Header: FunctionComponent<{ user: UserDTO }> = ({ user }) => {
	return (
		<GridHeader>
			<HeaderLeft>
				<Logo src="/charity_royale_logo.png" alt="Charity Royale logo" height="36px" />
				<Heading>PROJECT: Feed the Pig</Heading>
			</HeaderLeft>

			<HeaderRight>
				<p>Welcome back {user.username}</p>
			</HeaderRight>
		</GridHeader>
	)
}

const GridHeader = styled.div`
	background-color: ${(p) => p.theme.color.background};
	grid-area: header;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: ${(p) => p.theme.space.xs}px ${(p) => p.theme.space.s}px;
	border-bottom: 1px solid ${(p) => p.theme.color.charityGold};
`

const HeaderLeft = styled.div`
	display: flex;
	align-items: center;
`

const HeaderRight = styled.div`
	display: flex;
	align-items: center;
`

const Logo = styled.img`
	margin-right: ${(p) => p.theme.space.m}px;
`

const Heading = styled.h1`
	font-size: ${(p) => p.theme.fontSize.l}px;
`
