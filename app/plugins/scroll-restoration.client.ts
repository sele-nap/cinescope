export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    history.scrollRestoration = 'manual'
  }
})
