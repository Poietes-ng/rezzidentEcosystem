/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          500: '#4caf50',
          600: '#43a047',
          700: '#388e3c',
          900: '#1b5e20',
        },
      },
      fontFamily: {
        sans: ['Inter'],
        mono: ['JetBrainsMono'],
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
};
