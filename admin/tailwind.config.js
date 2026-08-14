/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        app: '#0f1117',
        surface: '#1a1d27',
        surface2: '#22263a',
        border: '#2e3250',
        foreground: '#e8eaf0',
        muted: '#6b7280',
      },
    },
  },
  plugins: [],
}
