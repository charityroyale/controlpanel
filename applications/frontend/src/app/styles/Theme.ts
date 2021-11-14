// References to https://blog.agney.dev/styled-components-&-typescript/
const customMediaQuery = (minWidth: number): string => `@media (min-width: ${minWidth}px)`

export const responsiveMaxSizeThreshold = {
	phone: 576,
	tablet: 910,
}

export const theme = {
	color: {
		white: 'white',
		black: 'black',
		primary: 'red',
		secondary: 'green',
		ludecatyellow: '#FFCC00',
		blackPeral: '#050F1A',
		decentBeton: '#E6E6E6',
		emerald: '#50C878',
		recordRed: '#e81224',
		disabled: '#9e9e9e',
		veniPurple: '#231565',
		willhaben: '#049EE7',
		charityPink: '#C03BE4',
		charityBlue: '#0999F9',
		charityTeal: '#7DF8FF',
		charityGold: '#ffd76e',
		background: '#18181B',
		piggyPink: '#EEADB6',
		highlighbackground: '#1f1f23',
		slightlyTransparent: 'rgba(255, 255, 255, 0.2)',
	},
	fontSize: {
		s: 12,
		m: 14,
		l: 18,
		xl: 24,
	},
	gridGrap: {
		phone: 8,
		tablet: 24,
		desktop: 28,
	},
	space: {
		xs: 4,
		s: 8,
		m: 12,
		l: 16,
		xl: 24,
		xxl: 36,
	},
	media: {
		desktop: customMediaQuery(responsiveMaxSizeThreshold.tablet),
		tablet: customMediaQuery(responsiveMaxSizeThreshold.phone),
		phone: customMediaQuery(0),
	},
}

export type Theme = typeof theme
