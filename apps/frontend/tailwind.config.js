const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
     content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html,scss}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
   safelist: ['dashboard', 'hidden'],
  darkMode: 'class',
   theme: {
     extend: {
      colors: {
        primary: {
  50: '#c0ffff',
  100: '#00ffff',
  200: '#00e3e3',
  300: '#00c7c7',
  400: '#00adad',
  500: '#009393',
  600: '#007a7a',
  700: '#006464',
  800: '#004c4c',
  900: '#002929',
  950: '#001919',
  DEFAULT: '#004c4c',
        },
        secondary: {
  50: '#fdedec',
  100: '#fbdbd8',
  200: '#f7b7af',
  300: '#f59486',
  400: '#f36748',
  500: '#d0502f',
  600: '#a73f24',
  700: '#802e19',
  800: '#581d0e',
  900: '#360f05',
  950: '#240803',
  DEFAULT: '#d0502f',
        }
      }
     },
   },
   plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/postcss'),
   ],
     options: {
    exclude: [/node_modules/],
  },
 };