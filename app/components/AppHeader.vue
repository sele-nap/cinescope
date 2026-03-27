<template>
  <header class="app-header">
    <div class="app-header__inner">
      <NuxtLink to="/" class="app-header__logo">
        <span class="app-header__logo-icon">✦</span>
        <span class="app-header__logo-text">Cinescope</span>
      </NuxtLink>
    </div>
  </header>
</template>

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
    font-size: 1.5rem;
    color: $color-primary;
  }

  &__logo-text {
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    background: linear-gradient(135deg, $color-primary, $color-accent);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
