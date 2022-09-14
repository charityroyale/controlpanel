import React, { FunctionComponent } from 'react'
import { AiOutlineLink } from 'react-icons/ai'
import CopyToClipboard from 'react-copy-to-clipboard'
import styled from 'styled-components'
import { toast } from 'react-toastify'

const iconSize = '18px'
interface CopyBrowserSourceButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	username: string
}
export const CopyBrowserSourceButton: FunctionComponent<React.PropsWithChildren<CopyBrowserSourceButtonProps>> = (props) => {
	return (
		<CopyToClipBoardButton {...props}>
			<CopyToClipboard
				text={window.location.origin + '/overlay/' + props.username}
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
