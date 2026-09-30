/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#6ee7b7',
          DEFAULT: '#10b981',
          dark: '#047857',
        }
      }
    },
  },
  plugins: [],
}
