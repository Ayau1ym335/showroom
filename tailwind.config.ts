import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#141210',
        paper: '#FAF8F4',
        card: '#FFFFFF',
        taupe: {
          DEFAULT: '#8B7355',
          soft: '#A99A87',
        },
        muted: '#706A60',
        line: '#E7E2D8',
        danger: '#A03B2E',
        success: '#4C6B4F',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        pill: '999px',
      },
    },
  },
  plugins: [],
};

export default config;
