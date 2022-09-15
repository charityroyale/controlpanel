import Head from 'next/head'
import React from 'react'
import styled from 'styled-components'
import { LoginPageContent } from '../../app/components/controlpanel/Login/LoginPageContent'

const LoginPage = () => {
	return (
		<React.Fragment>
			<Head>
				<title>Login | Charity Royale</title>
			</Head>
			<LoginPageWrapper>
				<LoginPageContentWrapper>
					<LoginPageContent />
				</LoginPageContentWrapper>
			</LoginPageWrapper>
		</React.Fragment>
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
	margin-bottom: 150px;
`

export default LoginPage
