export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  future: {
    compatibilityVersion: 4,
  },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },
  typescript: {
    strict: true,
  },
})
