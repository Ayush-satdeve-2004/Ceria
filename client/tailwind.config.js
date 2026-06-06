/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B3DFF',
          dark: '#5B21B6',
          light: '#C084FC',
        },
        secondary: {
          DEFAULT: '#8B3DFF',
          hover: '#5B21B6',
          light: '#C084FC',
        },
        accent: {
          DEFAULT: '#C084FC',
          hover: '#8B3DFF',
          light: '#E9D5FF',
        },
        bgLight: '#FAF9FF',
        bgDark: '#0A0617',
        cardDark: '#140B2D',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
