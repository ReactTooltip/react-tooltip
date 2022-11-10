/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/components/*.{html,js,jsx,ts,tsx}',
    './src/**/*.{html,js,jsx,ts,tsx}',
    './src/*.{html,js,jsx,ts,tsx}',
    './src/index-dev.tsx',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
