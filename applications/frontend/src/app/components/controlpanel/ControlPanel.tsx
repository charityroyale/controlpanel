import { GlobalState } from '@pftp/common'
import React, { FunctionComponent } from 'react'
import { UserDTO } from '../../../pages/api/sessions'
import { BottomPanel } from './BottomPanel'
import { CenterPanel } from './CenterPanel/CenterPanel'
import { Header } from './Header'
import { LeftPanel } from './LeftPanel'
import { RightPanel } from './RightPanel/RightPanel'

export const ControlPanel: FunctionComponent<{ globalState: GlobalState; user: UserDTO }> = ({ globalState, user }) => {
	return (
		<React.Fragment>
			<Header user={user}>Header</Header>
			<LeftPanel globalState={globalState}>Left-Panel</LeftPanel>
			<CenterPanel globalState={globalState}>Center-Panel</CenterPanel>
			<RightPanel>Right-Panel</RightPanel>
			<BottomPanel globalState={globalState}>Bottom-Panel</BottomPanel>
		</React.Fragment>
	)
}
