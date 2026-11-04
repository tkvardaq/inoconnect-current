/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

// Design tokens — see UI_CONSISTENCY_PLAN.md §2. Use these names in classes, never raw hex.
module.exports = {
  content: [
    './**/*.html',
    './assets/**/*.js',
    '!./node_modules/**',
    '!./_deploy/**',
    '!./outputs/**',
    '!./.work/**',
    '!./_plan/**'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        heading: ['Outfit', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        primary: '#4169E1',
        'primary-dark': '#3152B3',
        'primary-soft': '#8DA7F5',
        secondary: '#44D7A8',
        'secondary-dark': '#33B88E',
        'secondary-ink': '#0F766E', // secondary as text on light backgrounds (AA)
        accent: '#FF7518',
        'accent-dark': '#E06612',
        'accent-ink': '#C2410C', // accent as text on light backgrounds (AA)
        heading: '#1e293b'
      }
    }
  },
  plugins: []
};
