/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { UserEntry } from '@pftp/common'

const StreamerSelect = styled.select`
	color: ${(p) => p.theme.color.background};
	& option {
		color: ${(p) => p.theme.color.background};
	}
`

const LoginPage = () => {
	const router = useRouter()
	const [showError, setShowError] = useState(false)
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [streamerOptions, setStreamerOptions] = useState([])

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		setShowError(false)
		const response = await fetch('/api/sessions', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password }),
		})

		if (response.ok) {
			return router.push('/')
		} else {
			setShowError(true)
		}
	}

	useEffect(() => {
		const fetchData = async () => {
			const result = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL as string)
			const json = await result.json()
			setStreamerOptions(json)
		}

		fetchData()
	}, [])

	return (
		<LoginPageWrapper>
			<LoginPageContent>
				<img src="/charity_royale_logo.png" alt="Logo" />
				<h1>Project: Feed the Pig</h1>
				<form onSubmit={handleSubmit}>
					<FormContent>
						<InputRow style={{ marginBottom: '8px' }}>
							<label htmlFor="username">Streamer</label>
							<StreamerSelect
								name="username"
								value={username}
								onChange={(e) => setUsername(e.currentTarget.value)}
								onBlur={(e) => setUsername(e.currentTarget.value)}
								required
							>
								{streamerOptions.map((el: UserEntry, i: number) => {
									return (
										<option key={`${el.channel}-${i}`} value={el.channel}>
											{el.streamer}
										</option>
									)
								})}
							</StreamerSelect>
						</InputRow>
						<InputRow>
							<label htmlFor="password">Passwort</label>
							<input type="password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} required />
						</InputRow>
					</FormContent>

					<ErrorMessage show={showError}>🧙You shall not pass.🧙</ErrorMessage>
					<div>
						<LoginButton type="submit">
							<span>Login</span>
						</LoginButton>
					</div>
				</form>
			</LoginPageContent>
		</LoginPageWrapper>
	)
}

const ErrorMessage = styled.div<{ show: boolean }>`
	color: ${(p) => p.theme.color.recordRed};
	margin: ${(p) => p.theme.space.m}px 0;
	visibility: ${(p) => (p.show ? 'visible' : 'hidden')};
	text-align: center;
`

const FormContent = styled.div``

const InputRow = styled.div`
	display: flex;
	justify-content: space-between;

	& > input {
		color: ${(p) => p.theme.color.background};
	}
`

const LoginPageWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
`

const LoginPageContent = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
`

const LoginButton = styled.button`
	border: none;
	border-radius: ${(p) => p.theme.space.xs}px;
	background-color: ${(p) => p.theme.color.willhaben};
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	padding: ${(p) => p.theme.space.m}px ${(p) => p.theme.space.xl}px;
	width: 100%;
`

export default LoginPage
