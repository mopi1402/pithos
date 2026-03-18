/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        martins: {
          red: "#B40024",
          "red-light": "#D0002B",
          gold: "#C5A258",
          cream: "#FAF6F1",
          dark: "#2C1810",
        },
      },
      fontFamily: {
        display: ["Georgia", "'Times New Roman'", "serif"],
        body: ["-apple-system", "'Segoe UI'", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
