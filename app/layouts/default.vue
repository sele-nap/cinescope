<template>
  <div class="min-h-screen flex flex-col bg-background text-text-base">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />

    <Transition name="scroll-top">
      <button
        v-if="showScrollTop"
        class="fixed bottom-8 right-8 z-50 w-11 h-11 rounded-full border border-moon/25 bg-surface/90 backdrop-blur-sm text-moon text-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-surface-elevated/95 hover:border-moon/50 hover:-translate-y-0.5"
        aria-label="Back to top"
        @click="scrollToTop"
      >
        ↑
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const { y: scrollY } = useWindowScroll()

const showScrollTop = computed<boolean>(() => scrollY.value > 400)

function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.scroll-top-enter-active,
.scroll-top-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.scroll-top-enter-from,
.scroll-top-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
