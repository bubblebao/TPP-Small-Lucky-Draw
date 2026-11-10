/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pavilions: {
          dark: '#44595B',
          slate: '#698A9A',
          darker: '#2d3d3f',
          darkest: '#1c2829',
          light: '#8ba6b4',
          ice: '#eaf0f2',
        },
        gold: {
          light: '#FDF0CD',
          DEFAULT: '#D4AF37',
          dark: '#B38F26',
          shimmer: '#F9DF7B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Prompt', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Cinzel', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-short': 'bounce 0.6s ease-in-out 2',
        'spin-fast': 'spin 0.4s linear infinite',
      }
    },
  },
  plugins: [],
}
