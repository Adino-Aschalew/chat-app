/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#4f46e5',
        dark: '#1a1a1a',
        darker: '#2d2d2d',
        light: '#e5e7eb',
        muted: '#9ca3af',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        border: '#404040',
      }
    },
  },
  plugins: [],
}
