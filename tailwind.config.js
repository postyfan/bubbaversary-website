/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'labubu': {
            'pink': '#FFC6FF',
            'rose': '#FAD2E1',
            'blush': '#FDE2E4',
            'lavender': '#DEE2FF',
            'mint': '#E2ECE9',
          }
        },
        animation: {
          'confetti': 'confetti-fall 3s ease-in-out forwards',
          'wiggle': 'wiggle 1s ease-in-out infinite',
          'float': 'float 3s ease-in-out infinite',
        },
        keyframes: {
          'confetti-fall': {
            '0%': {
              transform: 'translateY(-100vh) rotate(0deg)',
              opacity: '1',
            },
            '100%': {
              transform: 'translateY(100vh) rotate(720deg)',
              opacity: '0',
            },
          },
          wiggle: {
            '0%, 100%': { transform: 'rotate(-3deg)' },
            '50%': { transform: 'rotate(3deg)' },
          },
          float: {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
        },
      },
    },
    plugins: [],
  }