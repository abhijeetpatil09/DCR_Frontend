/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  important: true,
  theme: {
    extend: {
      colors: {
        "deep-navy": "#0A2756",
        "electric-green": "#00FFB4",
        ash: "#f5f5f5",
        smoke: "#eeeeee",
        silver: "#bfbfbf",
        coal: "#242424",
        "true-teal": "#00B5B1",
        "bright-blue": "#0080FF",
        "orange-highlight": "#EF5B2B",
        "new-gold": "#FFA800",
        amaranth: {
          50: "#fff1f4",
          100: "#ffe3e8",
          200: "#ffcbd8",
          300: "#ffa1b8",
          400: "#ff6d94",
          500: "#fa3972",
          600: "#e91f64",
          700: "#c40c4f",
          800: "#a40d49",
          900: "#8c0f45",
          950: "#4e0321",
        },
        downriver: {
          50: "#ecf9ff",
          100: "#d4f0ff",
          200: "#b3e6ff",
          300: "#7ed8ff",
          400: "#42bfff",
          500: "#179cff",
          600: "#007cff",
          700: "#0063fc",
          800: "#0250cb",
          900: "#09479f",
          950: "#0a2756",
        },
      },
      transitionProperty: {
        width: "width",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
