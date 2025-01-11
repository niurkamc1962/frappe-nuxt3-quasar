// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@nuxt/image',
    'nuxt-quasar-ui',
  ],
})