/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1F3D2B',
          dark: '#1F3D2B',
        },
        cream: {
          DEFAULT: '#F5F3EE',
          white: '#F5F3EE',
        },
        coffee: {
          DEFAULT: '#6F4E37',
          brown: '#6F4E37',
        },
        accent: {
          orange: '#FF8C42',
          pink: '#F4A3B4',
          yellow: '#FFD166',
        },
      },
      fontFamily: {
        heading: ['Alexandria', 'Poppins', 'Montserrat', 'sans-serif'],
        body: ['Alexandria', 'Inter', 'Open Sans', 'sans-serif'],
        logo: ['Bigfat Script', 'Alexandria', 'cursive'],
        script: ['Extra Beige', 'Alexandria', 'cursive'],
      },
      spacing: {
        'section': '96px',
        'section-mobile': '56px',
      },
    },
  },
  plugins: [],
}

