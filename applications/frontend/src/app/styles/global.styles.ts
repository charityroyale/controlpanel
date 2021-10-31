import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`

	html {
		width: 100%;
		height: 100%;
	}


	#pftp-overlay canvas {
		display: block;
	}

	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
	}
	
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: #666; 
	}

	body {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
	    background-color: #18181B;
	}

	#__next {
		width: 100%;
		height: 100%;
	}

	p {
		margin: 0;
		padding: 0;
	}

	* {
		box-sizing: border-box;
		font-family: 'Roboto', sans-serif;
		color: #efeff1;
	}
`
