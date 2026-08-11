/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './partials/**/*.html',
    './js/**/*.js'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#FFFFFF',
        charcoal: '#0A0A0C'
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif']
      }
    }
  },
  plugins: []
}
