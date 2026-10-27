/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        skycast: {
          bg: '#0B132B',
          card: '#111C38',
          cardHover: '#162447',
          surface: '#1A274E',
          cyan: '#00D2FF',
          blue: '#38BDF8',
          accent: '#0284C7',
          border: 'rgba(56, 189, 248, 0.15)',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(56, 189, 248, 0.25)',
        'glow-cyan': '0 0 30px -5px rgba(0, 210, 255, 0.35)',
      },
    },
  },
  plugins: [],
};
