import { useContext } from 'react'
import { GlobalStateContext } from '../provider/GlobalStateProvider'

export const useGlobalState = () => useContext(GlobalStateContext)
