import React, { FunctionComponent } from 'react'
import { AiOutlineLink } from 'react-icons/ai'
import CopyToClipboard from 'react-copy-to-clipboard'
import { styled } from '../../../styles/Theme'
import { toast } from 'react-toastify'

const iconSize = '18px'
export const CopyBrowserSourceButton: FunctionComponent<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
	return (
		<CopyToClipBoardButton {...props}>
			<CopyToClipboard
				text={window.location.origin + '/overlay'}
				onCopy={() => toast('Browser source for stream copied.', { type: 'success' })}
			>
				<AiOutlineLink size={iconSize} />
			</CopyToClipboard>
		</CopyToClipBoardButton>
	)
}

const CopyToClipBoardButton = styled.button`
	border: none;
	background-color: transparent;
	cursor: pointer;
	display: flex;
	align-items: center;
`