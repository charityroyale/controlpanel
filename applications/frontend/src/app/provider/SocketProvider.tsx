import React, { useEffect } from 'react'
import { createContext, FunctionComponent, useState } from 'react'
import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client'
import { PFTPSocketEventsMap } from '@pftp/common'
import { toast } from 'react-toastify'
import { useRouter } from 'next/dist/client/router'

export interface SockerContextState {
	socket: Socket<PFTPSocketEventsMap> | null
	isConnected: boolean
}

const socketDefaultValue: SockerContextState = {
	socket: null,
	isConnected: false,
}

export const SocketContext = createContext<SockerContextState>(socketDefaultValue)
export const SocketProvider: FunctionComponent<{ auth?: { token: string; channel: string } }> = ({
	children,
	auth,
}) => {
	const [socket, setSocket] = useState<Socket<PFTPSocketEventsMap> | null>(socketDefaultValue.socket)

	useEffect(() => {
		console.log(`Authorization: ${auth}`)
		const options: Partial<ManagerOptions & SocketOptions> = {
			transports: ['websocket', 'polling'],
		}
		if (auth !== undefined) {
			options.auth = { token: auth.token, channel: auth.channel }
		}

		setSocket(io(process.env.NEXT_PUBLIC_SOCKET_URL as string, options))
	}, [auth])

	const [isConnected, setIsConnected] = useState(socket ? socket.connected : false)
	const router = useRouter()

	useEffect(() => {
		const cleanup = () => {
			if (socket) {
				socket.disconnect()
			}
		}

		if (socket) {
			return cleanup
		}
		return
	}, [socket])

	useEffect(() => {
		socket?.on('disconnect', () => {
			setIsConnected(false)
			if (router.pathname.includes('controlpanel')) {
				toast('Socket disconnected', { type: 'warning' })
			}
		})
		socket?.on('connect', () => {
			setIsConnected(true)
			if (router.pathname.includes('controlpanel')) {
				toast('Socket connected', { type: 'info' })
			}
		})
	}, [socket, router])

	return (
		<SocketContext.Provider
			value={{
				socket,
				isConnected,
			}}
		>
			{children}
		</SocketContext.Provider>
	)
}
