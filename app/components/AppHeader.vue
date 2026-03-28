<template>
  <header class="app-header">
    <div class="app-header__inner">
      <NuxtLink to="/" class="app-header__logo">
        <span class="app-header__logo-icon">✦</span>
        <span class="app-header__logo-text">Cinescope</span>
      </NuxtLink>

      <span class="app-header__cat" title="meow">🐈‍⬛</span>

      <div class="app-header__lang">
        <button
          v-for="loc in locales"
          :key="loc.code"
          class="app-header__lang-btn"
          :class="{ 'app-header__lang-btn--active': loc.code === locale }"
          @click="setLocale(loc.code)"
        >
          {{ loc.code.toUpperCase() }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

</script>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: rgba($color-background, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid $color-border;

  &__inner {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: $color-text;
    transition: opacity $transition-base;

    &:hover {
      opacity: 0.8;
    }
  }

  &__logo-icon {
    font-size: 1.75rem;
    color: $color-moon;
    filter: drop-shadow(0 0 6px rgba($color-primary, 0.6));
    line-height: 1;
  }

  &__logo-text {
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    background: linear-gradient(135deg, $color-moon 0%, $color-primary 60%, $color-accent 100%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &__cat {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.1rem;
    opacity: 0.05;
    cursor: default;
    transition: opacity 0.4s ease;

    &:hover {
      opacity: 1;
    }
  }

  &__lang {
    display: flex;
    gap: 0.25rem;
  }

  &__lang-btn {
    background: none;
    border: 1px solid $color-border;
    border-radius: $border-radius-sm;
    color: $color-text-muted;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    padding: 0.25rem 0.6rem;
    transition: color $transition-base, border-color $transition-base;

    &:hover {
      color: $color-text;
      border-color: $color-text-muted;
    }

    &--active {
      color: $color-moon;
      border-color: $color-moon;
      box-shadow: 0 0 8px rgba($color-primary, 0.3);
    }
  }
}
</style>
