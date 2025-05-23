/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { UserEntry } from '@cp/common'
import { toast } from 'react-toastify'

export const LoginPageContent = () => {
	const router = useRouter()
	const [showError, setShowError] = useState(false)
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [streamerOptions, setStreamerOptions] = useState<UserEntry[]>([])

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		setShowError(false)

		if (!username) {
			toast('No streamer was selected', { type: 'warning' })
			return
		}

		const type = streamerOptions.find((entry) => entry.channel === username)?.type
		if (!type) {
			toast('No streamer type found', { type: 'warning' })
			return
		}

		const response = await fetch('/api/sessions', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				username,
				password,
				type,
			}),
		})

		if (response.ok) {
			return router.push('/')
		} else {
			setShowError(true)
		}
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL as string}/streamers`)
				const json = (await result.json()) as UserEntry[]

				if (json.length <= 0) {
					throw new Error('No streamdata found.')
				}
				const sortedStreamers = json.sort((a, b) => {
					if (a.channel < b.channel) {
						return -1
					}
					if (a.channel > b.channel) {
						return 1
					}
					return 0
				})
				setUsername(sortedStreamers[0].streamer)
				setStreamerOptions(sortedStreamers)
			} catch (e) {
				toast('No streamer data was found', { type: 'warning' })
			}
		}

		fetchData()
	}, [])

	return (
		<React.Fragment>
			<img src="/charity_royale_logo.png" alt="Logo" style={{ marginBottom: '24px' }} />
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

				<ErrorMessage $show={showError}>🧙You shall not pass.🧙</ErrorMessage>
				<div>
					<LoginButton type="submit">
						<span>Login</span>
					</LoginButton>
				</div>
			</form>{' '}
			<HammertimeLink>
				{' '}
				powered by{' '}
				<a href="https://hammertime.studio" target="_blank" rel="noreferrer">
					hammertime.studio
				</a>
			</HammertimeLink>
		</React.Fragment>
	)
}

const HammertimeLink = styled.p`
	margin-top: 12px;
	text-align: right;
	font-size: ${(p) => p.theme.fontSize.s}px;
`

const ErrorMessage = styled.div<{ $show: boolean }>`
	color: ${(p) => p.theme.color.recordRed};
	margin: ${(p) => p.theme.space.m}px 0;
	visibility: ${(p) => (p.$show ? 'visible' : 'hidden')};
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
const StreamerSelect = styled.select`
	color: ${(p) => p.theme.color.background};
	& option {
		color: ${(p) => p.theme.color.background};
	}
`
