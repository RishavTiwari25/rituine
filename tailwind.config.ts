import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        indigo: {
          950: '#0f0f2d',
        },
      },
      animation: {
        'check-pop': 'checkPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'fade-slide': 'fadeSlideIn 0.4s ease-out forwards',
        'card-pulse': 'cardPulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
