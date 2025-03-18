/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
	theme: {
		extend: {
			borderRadius: {
				// lg: 'var(--radius)',
				// md: 'calc(var(--radius) - 2px)',
				// sm: 'calc(var(--radius) - 4px)'
			},
			colors: {},
			fontFamily: {
				kumbh: ['Kumbh Sans', 'sans-serif'],
				poppins: ['Poppins', 'sans-serif']
			},
		},
	},
	safelist: [
		'font-kumbh', // Safelist the 'font-kumbh' class to prevent purging in production
	],
	plugins: [require("tailwindcss-animate")],
}
