/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Romantic color palette
        romantic: {
          50: '#fdf2f8',   // lightest pink
          100: '#fce7f3',  // very light pink
          200: '#fbcfe8',  // light pink
          300: '#f9a8d4',  // soft pink
          400: '#f472b6',  // medium pink
          500: '#ec4899',  // main pink
          600: '#db2777',  // darker pink
          700: '#be185d',  // deep pink
          800: '#9d174d',  // very deep pink
          900: '#831843',  // darkest pink
        },
        blush: {
          50: '#fef7f0',   // lightest blush
          100: '#feeee0',  // very light blush
          200: '#fdd5b8',  // light blush
          300: '#fcb88f',  // soft blush
          400: '#fa9b67',  // medium blush
          500: '#f97316',  // main blush/orange
          600: '#ea580c',  // darker blush
          700: '#c2410c',  // deep blush
          800: '#9a3412',  // very deep blush
          900: '#7c2d12',  // darkest blush
        },
        lavender: {
          50: '#faf5ff',   // lightest lavender
          100: '#f3e8ff',  // very light lavender
          200: '#e9d5ff',  // light lavender
          300: '#d8b4fe',  // soft lavender
          400: '#c084fc',  // medium lavender
          500: '#a855f7',  // main lavender
          600: '#9333ea',  // darker lavender
          700: '#7c3aed',  // deep lavender
          800: '#6b21a8',  // very deep lavender
          900: '#581c87',  // darkest lavender
        },
        gold: {
          50: '#fffbeb',   // lightest gold
          100: '#fef3c7',  // very light gold
          200: '#fde68a',  // light gold
          300: '#fcd34d',  // soft gold
          400: '#fbbf24',  // medium gold
          500: '#f59e0b',  // main gold
          600: '#d97706',  // darker gold
          700: '#b45309',  // deep gold
          800: '#92400e',  // very deep gold
          900: '#78350f',  // darkest gold
        }
      },
      fontFamily: {
        'romantic': ['Great Vibes', 'cursive'],
        'elegant': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
      animation: {
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'slideUp': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(236, 72, 153, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(236, 72, 153, 0.8)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'romantic-gradient': 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #e9d5ff 100%)',
        'sunset-gradient': 'linear-gradient(135deg, #fef7f0 0%, #fdd5b8 50%, #fcd34d 100%)',
      }
    },
  },
  plugins: [],
} 