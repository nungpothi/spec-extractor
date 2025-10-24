/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'pastel': {
          light: '#fdf7ff',
          accent: '#9ab4f8',
          secondary: '#f7b2d9',
          input: '#f9f5ff',
          header: '#dce2f0',
        }
      },
      backgroundColor: {
        'pastel-light': '#fdf7ff',
        'pastel-accent': '#9ab4f8',
        'pastel-secondary': '#f7b2d9',
        'pastel-input': '#f9f5ff',
        'pastel-header': '#dce2f0',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}