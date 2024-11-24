/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#9333EA', // Purple
          hover: '#A855F7'
        },
        secondary: {
          DEFAULT: '#06B6D4', // Cyan
          hover: '#22D3EE'
        },
        accent: {
          DEFAULT: '#E879F9', // Magenta
          hover: '#F0ABFC'
        },
        highlight: {
          DEFAULT: '#84CC16', // Lime
          hover: '#A3E635'
        },
        dark: {
          DEFAULT: '#0F172A',
          lighter: '#1E293B'
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    },
  },
  plugins: [],
};