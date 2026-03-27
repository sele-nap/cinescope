export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'vuetify-nuxt-module',
    '@nuxt/eslint',
  ],

  vuetify: {
    moduleOptions: {
      styles: { configFile: 'assets/styles/vuetify.scss' },
    },
  },

  css: ['~/assets/styles/main.scss'],

  typescript: {
    strict: true,
  },
})
