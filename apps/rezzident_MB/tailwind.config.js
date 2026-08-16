const { colors, fontSize, spacing, borderRadius } = require('@rezzident/design-tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors,
      fontSize,
      spacing,
      borderRadius,
      fontFamily: {
        dmsans: ['DMSans'],
      },
    },
  },
  plugins: [],
};
