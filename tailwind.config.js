/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Jost', 'sans-serif'],
      },
      colors: {
        primary: '#a578fd',
        secondary: {
          dark: '#5A4689',
          medium: '#685bc7',
          light: '#E7D8FF',
        },
      },
    },
  },
  plugins: [],
};
