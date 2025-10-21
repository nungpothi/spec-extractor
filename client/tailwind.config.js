/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          sky: '#bae6fd',
          lilac: '#c7d2fe',
          blush: '#fbcfe8',
          ink: '#0f172a',
        },
      },
      boxShadow: {
        soft: '0px 32px 80px rgba(59, 130, 246, 0.18)',
      },
    },
  },
  plugins: [],
}