/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Quicksand', 'system-ui', 'sans-serif'],
        display: ['Sunday Morning', 'cursive'],
        script: ['Great Vibes', 'cursive'],
      },
      colors: {
        crave: {
          'cocoa': '#3B2A26',
          'cream': '#F6EFE6',
          'blush': '#D96B6B',
          'pistachio': '#A8C3A0',
          'caramel': '#D8A47F',
          'lavender': '#D6C3DA',
        },
        brand: {
          50: '#F6EFE6',
          100: '#F0E8DD',
          400: '#D96B6B',
          500: '#D8A47F',
          600: '#A8C3A0',
          700: '#3B2A26',
        },
        dark: {
          950: '#3B2A26',
          900: '#5C3F38',
          800: '#6B4D47',
          700: '#8B6F69',
          600: '#A88A82',
          500: '#C7A89F',
        },
      },
    },
  },
  plugins: [],
}
