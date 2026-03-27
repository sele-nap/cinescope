<template>
  <footer class="app-footer">
    <p class="app-footer__text">
      {{ $t('footer.powered_by') }}
      <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer">TMDB</a>
    </p>
  </footer>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.app-footer {
  border-top: 1px solid $color-border;
  padding: 1.5rem 2rem;
  text-align: center;

  &__text {
    font-size: 0.875rem;
    color: $color-text-muted;

    a {
      color: $color-primary;
      transition: color $transition-base;

      &:hover {
        color: $color-accent;
      }
    }
  }
}
</style>
