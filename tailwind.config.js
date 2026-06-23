/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['var(--font-tajawal)', 'system-ui', 'sans-serif'] },
      colors: {
        trust: { DEFAULT: '#1d4ed8', light: '#3b82f6', dark: '#1e3a8a', 50: '#eff6ff' },
        growth: { DEFAULT: '#16a34a', light: '#22c55e', dark: '#15803d', 50: '#f0fdf4' },
        ink: '#0f172a',
      },
      boxShadow: {
        soft: '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
        lift: '0 10px 30px -10px rgba(15,23,42,0.15)',
      },
      borderRadius: { xl2: '1.25rem' },
      keyframes: {
        fadeUp: { '0%': { opacity: 0, transform: 'translateY(12px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        toast: { '0%': { opacity: 0, transform: 'translateY(10px)' }, '10%,90%': { opacity: 1, transform: 'translateY(0)' }, '100%': { opacity: 0 } },
      },
      animation: { fadeUp: 'fadeUp .5s ease both', toast: 'toast 3s ease forwards' },
    },
  },
  plugins: [],
};
