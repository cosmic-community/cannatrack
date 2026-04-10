/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        slate: {
          25: '#fcfcfd',
          75: '#f3f4f7',
        },
        glass: {
          surface: 'hsl(var(--glass-tint-h) var(--glass-tint-s) var(--glass-tint-l) / <alpha-value>)',
          border: 'hsl(var(--glass-border-h) var(--glass-border-s) var(--glass-border-l) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        glass: 'var(--glass-radius)',
      },
      boxShadow: {
        glass: '0 12px var(--glass-shadow) hsl(0 0% 0% / var(--glass-shadow-opacity))',
      },
    },
  },
  plugins: [],
}