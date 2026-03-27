import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,js,ts,jsx,tsx}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0e0c1a',
        surface: '#1c1830',
        'surface-elevated': '#261f3d',
        primary: '#9b72cf',
        'primary-dark': '#7a56a8',
        accent: '#c8a951',
        secondary: '#4a7c59',
        'text-base': '#ede8dc',
        'text-muted': '#8a7fa0',
        border: '#2e2847',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
      },
      transitionDuration: {
        base: '200ms',
      },
    },
  },
  plugins: [],
} satisfies Config
