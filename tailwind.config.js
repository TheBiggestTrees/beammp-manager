const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx}'],
  mode: 'jit',
  theme: {
    colors: {
      // add other colors in here

      // import all colors for a wide range of pick
      ...colors,
    },
    extend: {},
  },
  plugins: [],
};
