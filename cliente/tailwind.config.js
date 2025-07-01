/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        leather: {
          100: '#f3e7dd',
          400: '#b18157',
          600: '#926b40',
          800: '#5a3b20',
          900: '#3a2618',
        },
      },
    },
  },
  plugins: [],
}
