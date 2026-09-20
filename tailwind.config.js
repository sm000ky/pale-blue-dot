/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#05070c',
        'void-lift': '#0d121c',
        paper: '#f3f4f6',
        'paper-dim': '#9ca3af',
        'paper-faint': '#4b5563',
        'pale-blue': '#89cff0',
        'pale-gold': '#f3c66f',
        rule: 'rgba(255, 255, 255, 0.08)'
      },
      fontFamily: {
        serif: ['"Newsreader"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        display: ['"Cinzel"', '"Newsreader"', 'serif']
      }
    },
  },
  plugins: [],
}
