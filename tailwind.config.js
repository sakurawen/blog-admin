module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	darkMode: 'class', // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				sidebar: '#F7F6F3',
				'sidebar-action': '#E8E7E4',
				'sidebar-t': '#37352f',
				black: '#202020',
				'black-deep': '#121212',
				'black-fading': '#2b2b2b',

				dark: '#1F2022',
				'dark-deep': '#17181A',
				'dark-fading': '#363739',

				light: '#ffffff',
				'light-fading': '#f5f5f5',
				'light-deep': '#EBEBEB',

				'theme-light': '#2563eb',
				'theme-light-deep': '#2563eb',
				'theme-light-fading': '#38bdf8',

				'theme-dark': '#0074E4',
				'theme-dark-light': '#288AE8',
				'theme-dark-deep': '#104B82',
			},
			fontFamily: {
				josefin: "'Josefin Sans', sans-serif",
			},
			content: {
				'blockquote-before': '"\\201C"',
				'blockquote-after': '"\\201D"',
			},
		},
	},
	plugins: [],
};
