import defaultTheme from "tailwindcss/defaultTheme"
import animations from '@midudev/tailwind-animations'

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
		'./node_modules/flowbite/**/*.js',
	],
	theme: {
		extend: {
			fontFamily: {
				avenir: ["Avenir"],
			},
			colors: {
				primary: "rgb(var(--color-primary) / <alpha-value>)",
				secondary: "rgb(var(--color-secondary) / <alpha-value>)",
				accent: "rgb(var(--color-accent) / <alpha-value>)"
			},
			screens: {
				xs: "360px",
				...defaultTheme.screens,
				"3xl": "1650px",
			},
		},
	},
	plugins: [
		animations,
		require('flowbite/plugin'),
	],
}
