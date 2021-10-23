import { GlobalState } from '@pftp/common'
import React, { FunctionComponent } from 'react'
import { BottomPanel } from './BottomPanel'
import { CenterPanel } from './CenterPanel'
import { Header } from './Header'
import { LeftPanel } from './LeftPanel'
import { RightPanel } from './RightPanel'

export const ControlPanel: FunctionComponent<{ globalState: GlobalState }> = ({ globalState }) => {
	return (
		<React.Fragment>
			<Header>Header</Header>
			<LeftPanel globalState={globalState}>Left-Panel</LeftPanel>
			<CenterPanel>Center-Panel</CenterPanel>
			<RightPanel>Right-Panel</RightPanel>
			<BottomPanel>Bottom-Panel</BottomPanel>
		</React.Fragment>
	)
}
