/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Roland Garros clay court orange
        clay: {
          50: "#fef7f0",
          100: "#fdebd9",
          200: "#fad4b1",
          300: "#f6b580",
          400: "#f18d4d",
          500: "#ed6f28",
          600: "#de541e",
          700: "#b83f1a",
          800: "#93341d",
          900: "#772d1b",
        },
      },
    },
  },
  plugins: [],
};
