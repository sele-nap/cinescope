import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
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
  })

  nuxtApp.vueApp.use(vuetify)
})
