/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        trust: { DEFAULT: '#1d4ed8', light: '#3b82f6', dark: '#1e3a8a' },
        growth: { DEFAULT: '#16a34a', light: '#22c55e', dark: '#15803d' },
      },
    },
  },
  plugins: [],
};
