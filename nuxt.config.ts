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
    vuetifyOptions: {
      theme: {
        defaultTheme: 'witchy',
        themes: {
          witchy: {
            dark: true,
            colors: {
              background: '#0e0c1a',
              surface: '#1c1830',
              primary: '#9b72cf',
              secondary: '#4a7c59',
              accent: '#c8a951',
              error: '#cf6679',
              warning: '#c8a951',
              info: '#72a0cf',
              success: '#4a7c59',
            },
          },
        },
      },
    },
    moduleOptions: {
      styles: 'sass',
    },
  },

  css: ['~/assets/styles/main.scss'],

  typescript: {
    strict: true,
  },
})
