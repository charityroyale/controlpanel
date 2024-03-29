import React from 'react'
import styled from 'styled-components'

const StyledLayout = styled.div`
	height: 100%;
	width: 100%;
`

interface MainLayoutProps {
	children: React.ReactNode
}

export const MainLayout: React.FunctionComponent<React.PropsWithChildren<MainLayoutProps>> = ({ children }: MainLayoutProps) => {
	return <StyledLayout>{children}</StyledLayout>
}
