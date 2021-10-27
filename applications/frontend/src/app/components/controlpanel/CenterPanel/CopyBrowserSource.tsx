import React from 'react'
import { AiOutlineLink } from 'react-icons/ai'
import CopyToClipboard from 'react-copy-to-clipboard'
import { styled } from '../../../styles/Theme'

const iconSize = '18px'
export const CopyBrowserSource = () => {
	return (
		<CopyLinkWrapper>
			<CopyToClipboard text={window.location.origin + '/overlay'}>
				<AiOutlineLink size={iconSize} />
			</CopyToClipboard>
		</CopyLinkWrapper>
	)
}

const CopyLinkWrapper = styled.span`
	cursor: pointer;
	display: flex;
	align-items: center;
`
