/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        alaska: {
          blue: '#003f87',
          'blue-light': '#0066cc',
          green: '#006838',
          'green-light': '#2d9f5f',
          gold: '#ffb612',
        }
      }
    },
  },
  plugins: [],
}
