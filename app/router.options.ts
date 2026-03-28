import type { RouterOptions } from '@nuxt/schema'

export default {
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return { ...savedPosition, behavior: 'instant' }
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return new Promise(resolve =>
      setTimeout(() => resolve({ top: 0, behavior: 'instant' }), 150),
    )
  },
} satisfies RouterOptions
