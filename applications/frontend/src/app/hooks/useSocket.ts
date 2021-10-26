import { useContext } from 'react'
import { SocketContext } from '../provider/SocketProvider'

export const useSocket = () => useContext(SocketContext)
