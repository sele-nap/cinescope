<template>
  <v-app>
    <AppHeader />
    <v-main>
      <slot />
    </v-main>
    <AppFooter />

    <Transition name="cat-overlay">
      <div v-if="catVisible" class="cat-overlay" @click="catVisible = false" @keydown.esc="catVisible = false">
        <div class="cat-overlay__box">
          <img :src="catUrl" alt="🐱" class="cat-overlay__img" />
          <p class="cat-overlay__caption">you found the secret cat ✦</p>
        </div>
      </div>
    </Transition>

    <Transition name="scroll-top">
      <button v-if="showScrollTop" class="scroll-top-btn" aria-label="Back to top" @click="scrollToTop">
        ↑
      </button>
    </Transition>
  </v-app>
</template>

<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import AppHeader from '~/components/AppHeader.vue'
import AppFooter from '~/components/AppFooter.vue'

const catVisible = useState('cat-easter-egg', () => false)
const catUrl = useState('cat-url', () => '')

const { y: scrollY } = useWindowScroll()

const showScrollTop = computed(() => scrollY.value > 400)

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.cat-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba($color-background, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &__box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
  }

  &__img {
    width: min(380px, 80vw);
    border-radius: $border-radius-lg;
    box-shadow: 0 16px 48px rgb(0 0 0 / 60%);
  }

  &__caption {
    font-size: 0.95rem;
    color: $color-moon;
    letter-spacing: 0.04em;
  }
}

.cat-overlay-enter-active,
.cat-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.cat-overlay-enter-from,
.cat-overlay-leave-to {
  opacity: 0;
}

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
