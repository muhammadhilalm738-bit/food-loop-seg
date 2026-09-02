/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Forest Green — human-edible / NGO theme
        forest: {
          50: '#f0f7f4',
          100: '#dceee5',
          200: '#bbddca',
          300: '#8cc4a4',
          400: '#5aa67b',
          500: '#3a8a5e',
          600: '#2a6e49',
          700: '#22583c',
          800: '#1d4732',
          900: '#193b2a',
          950: '#0d2418',
        },
        // Earthy Amber — farm / biogas theme
        earth: {
          50: '#fbf6ef',
          100: '#f5e9d6',
          200: '#ead0a8',
          300: '#dcb076',
          400: '#cf9450',
          500: '#c07d3e',
          600: '#a6642f',
          700: '#874d28',
          800: '#6e3f25',
          900: '#5a3520',
          950: '#331a10',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
};
