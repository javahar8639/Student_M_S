/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F7F4EE',
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#262320',
          soft: '#6B665C',
          faint: '#9A9587',
        },
        border: {
          DEFAULT: '#E6E0D3',
          soft: '#EFEAE0',
        },
        accent: {
          DEFAULT: '#2F4B3F',
          dark: '#213229',
          light: '#E7EEE9',
        },
        info: {
          DEFAULT: '#3E5C76',
          light: '#E9EEF3',
        },
        success: {
          DEFAULT: '#3F7355',
          light: '#E7F1EA',
        },
        warning: {
          DEFAULT: '#A2732A',
          light: '#F5EDDD',
        },
        danger: {
          DEFAULT: '#A23E32',
          light: '#F5E6E3',
        },
      },
      fontFamily: {
        serif: ['"Lora"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        lg: '14px',
        xl: '18px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(38, 35, 32, 0.04), 0 4px 16px rgba(38, 35, 32, 0.05)',
        card: '0 1px 3px rgba(38, 35, 32, 0.06), 0 8px 24px rgba(38, 35, 32, 0.06)',
        modal: '0 20px 60px rgba(38, 35, 32, 0.25)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        fadeSlideUp: { '0%': { opacity: 0, transform: 'translateY(6px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: 0, transform: 'scale(0.97)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
      },
      animation: {
        fadeIn: 'fadeIn 200ms ease-out',
        fadeSlideUp: 'fadeSlideUp 250ms ease-out',
        scaleIn: 'scaleIn 180ms ease-out',
      },
    },
  },
  plugins: [],
};
