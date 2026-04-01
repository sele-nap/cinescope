import type { RouterOptions } from '@nuxt/schema'

export default {
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return false
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    // Going back to home: onActivated handles scroll restoration
    if (to.path === '/' && from?.path?.startsWith('/movies/')) return false
    // Going to a movie page: the movie page scrolls to top itself in onMounted
    if (to.path.startsWith('/movies/')) return false
    return new Promise(resolve =>
      setTimeout(() => resolve({ top: 0, behavior: 'instant' }), 150),
    )
  },
} satisfies RouterOptions
