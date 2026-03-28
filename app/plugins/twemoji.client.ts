import twemoji from '@twemoji/api'

export default defineNuxtPlugin(() => {
  const nuxtApp = useNuxtApp()

  nuxtApp.hook('page:finish', () => {
    twemoji.parse(document.body, {
      folder: '72x72',
      ext: '.png',
      className: 'twemoji',
    })
  })
})
