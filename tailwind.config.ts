import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#E64646', dark: '#c93a3a', light: 'rgba(230, 70, 70, 0.12)' },
      },
      fontFamily: { sans: ['var(--font-inter)', 'system-ui', 'sans-serif'] },
      boxShadow: {
        card: '0 4px 24px -4px rgba(0, 0, 0, 0.08)',
        'card-lg': '0 12px 40px -12px rgba(0, 0, 0, 0.12)',
      },
      transitionDuration: { 600: '600ms' },
    },
  },
  plugins: [],
}
export default config
