/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        Red: "#dc0812",
        DarkBlue: "#0c2245",
        Light: "#f1f5fb",
        Blue: "#0b3d8b"
      }
    },
  },
  plugins: [],
}

