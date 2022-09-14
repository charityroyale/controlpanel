import React from 'react'
import styled from 'styled-components'
import { LoginPageContent } from '../../app/components/controlpanel/Login/LoginPageContent'

const LoginPage = () => {
	return (
		<LoginPageWrapper>
			<LoginPageContentWrapper>
				<LoginPageContent />
			</LoginPageContentWrapper>
		</LoginPageWrapper>
	)
}

const LoginPageWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
`

const LoginPageContentWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
`

export default LoginPage
