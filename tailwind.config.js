/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          primary: 'var(--bg-primary)',
          sidebar: 'var(--bg-sidebar)',
          card: 'var(--bg-card)',
          border: 'var(--border-color)',
          accent: 'var(--accent-color)',
          text: 'var(--text-main)',
          sticky: 'var(--sticky-yellow)',
        }
      },
      fontFamily: {
        ui: ['Nunito', 'Fredoka', 'system-ui', 'sans-serif'],
        display: ['Fredoka', 'Nunito', 'sans-serif'],
        handwriting: ['Caveat', 'Patrick Hand', 'cursive'],
        steward: ['"KG Miss Steward"', 'Schoolbell', '"Patrick Hand"', 'Caveat', 'cursive', 'sans-serif'],
        patrick: ['Patrick Hand', 'cursive'],
      },
      boxShadow: {
        'cozy': '0 2px 10px rgba(80, 60, 40, 0.06)',
        'cozy-md': '0 4px 16px rgba(80, 60, 40, 0.09)',
        'cozy-lg': '0 8px 24px rgba(80, 60, 40, 0.12)',
        'sticky': '0 3px 12px rgba(160, 130, 40, 0.15)',
      }
    },
  },
  plugins: [],
}
