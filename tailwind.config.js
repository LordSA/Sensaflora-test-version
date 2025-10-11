/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C69238',
          dark: '#1A1210',
          light: '#F2E9D8',
        },
        secondary: {
          DEFAULT: '#BCA98C',
          gold: '#D4A243',
          light: '#F2C572',
        },
        dark: {
          DEFAULT: '#2A1F1D',
          brown: '#3D2E2B',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-playfair-display)'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}