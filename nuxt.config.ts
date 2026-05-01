export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    head: {
      title: 'Cinescope',
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  runtimeConfig: {
    tmdbApiKey: process.env.TMDB_API_KEY,
    public: {
      tmdbBaseUrl: 'https://api.themoviedb.org/3',
      tmdbImageBaseUrl: 'https://image.tmdb.org/t/p',
    },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
  ],

  i18n: {
    locales: [
      { code: 'fr', language: 'fr-FR', file: 'fr.json', name: 'Français' },
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English' },
    ],
    defaultLocale: 'fr',
    langDir: 'locales',
    strategy: 'no_prefix',
  },

  vite: {
    ssr: {
      noExternal: ['@tinymce/tinymce-vue', 'tinymce'],
    },
  },

  css: ['~/assets/styles/main.scss'],

  typescript: {
    strict: true,
  },

  serverDir: './server',
})
