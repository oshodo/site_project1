/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f5f5',
          100: '#ebebeb',
          200: '#d6d6d6',
          300: '#b8b8b8',
          400: '#8a8a8a',
          500: '#111111',
          600: '#0a0a0a',
          700: '#050505',
          800: '#030303',
          900: '#000000',
          950: '#000000',
        },
        accent: {
          50: '#fdf8ef',
          100: '#f5efe4',
          200: '#e8d9bb',
          300: '#d9be90',
          400: '#c8a96e',
          500: '#b8965a',
          600: '#9a7a44',
          700: '#7d6238',
          800: '#614b2c',
          900: '#4a3820',
        },
      },
      fontFamily: {
        body: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { '0%': { opacity: 0.5 }, '50%': { opacity: 1 }, '100%': { opacity: 0.5 } },
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(0,0,0,0.06)',
        'medium': '0 8px 32px rgba(0,0,0,0.08)',
        'strong': '0 16px 48px rgba(0,0,0,0.12)',
        'accent': '0 4px 20px rgba(200,169,110,0.3)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
