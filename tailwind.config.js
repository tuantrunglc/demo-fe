/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#3b82f6', // Blue color for develop-vn
        'primary-hover': '#2563eb',
      },
      maxWidth: {
        'mobile': '430px',
      },
      fontFamily: {
        'lemonada': ['Lemonada', 'cursive'],
      },
    },
  },
  plugins: [],
}