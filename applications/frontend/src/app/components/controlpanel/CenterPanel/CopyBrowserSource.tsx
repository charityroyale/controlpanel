import React from 'react'
import { AiOutlineLink } from 'react-icons/ai'
import CopyToClipboard from 'react-copy-to-clipboard'
import ReactTooltip from 'react-tooltip'
import { styled } from '../../../styles/Theme'

export const CopyBrowserSource = () => {
	return (
		<CopyLinkWrapper
			data-tip="Copy BrowserSource."
			data-border-color="#049EE7"
			data-border={true}
			data-effect="solid"
			data-delay-show={500}
		>
			<CopyToClipboard text={window.location.origin + '/overlay'}>
				<AiOutlineLink />
			</CopyToClipboard>
			<ReactTooltip />
		</CopyLinkWrapper>
	)
}

const CopyLinkWrapper = styled.span`
	cursor: pointer;
	display: flex;
	align-items: center;
`
