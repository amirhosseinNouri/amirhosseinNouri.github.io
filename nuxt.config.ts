// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/eslint', '@nuxt/ui', 'nuxt-gtag'],
  gtag: {
    id: process.env.NUXT_PUBLIC_GTAG_ID || 'G-8NCFLTG53R',
    enabled: process.env.NODE_ENV === 'production'
  },
  typescript: {
    strict: true,
    typeCheck: true
  }
})
