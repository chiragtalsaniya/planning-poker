/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E4002B',
        disabled: '#64748B',
      },
    },
  },
  plugins: [],
}
