<template>
  <v-app>
    <AppHeader />
    <v-main>
      <slot />
    </v-main>
    <AppFooter />

    <Transition name="scroll-top">
      <button v-if="showScrollTop" class="scroll-top-btn" aria-label="Retour en haut" @click="scrollToTop">
        ↑
      </button>
    </Transition>
  </v-app>
</template>

<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import AppHeader from '~/components/AppHeader.vue'
import AppFooter from '~/components/AppFooter.vue'

const { y: scrollY } = useWindowScroll()

const showScrollTop = computed(() => scrollY.value > 400)

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.scroll-top-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 50;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  border: 1px solid rgba($color-moon, 0.25);
  background: rgba($color-surface, 0.9);
  backdrop-filter: blur(8px);
  color: $color-moon;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background $transition-base, border-color $transition-base, transform $transition-base;

  &:hover {
    background: rgba($color-surface-elevated, 0.95);
    border-color: rgba($color-moon, 0.5);
    transform: translateY(-2px);
  }
}

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
