/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'deep-navy': '#0A2756',
        'electric-green': '#00FFB4',
        'ash': '#f5f5f5',
        'smoke': '#eeeeee',
        'silver': '#bfbfbf',
        'coal': '#242424',
        'true-teal': '#00B5B1',
        'bright-blue': '#0080FF',
        'orange-highlight': '#EF5B2B',
        'new-gold': '#FFA800'
      },
      transitionProperty: {
        'width': 'width'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

