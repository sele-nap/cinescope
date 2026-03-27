<template>
  <main class="home">
    <section class="home__hero">
      <div class="home__hero-inner">
        <h1 class="home__title">Découvrez votre prochain film</h1>
        <div class="home__search">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un film..."
            class="home__search-input"
            @input="onSearchInput"
          />
          <button v-if="searchQuery" class="home__search-clear" @click="clearSearch">✕</button>
        </div>
      </div>
    </section>

    <section class="home__content">
      <div class="home__content-inner">
        <div class="home__section-header">
          <h2 class="home__section-title">
            {{ isSearching ? `Résultats pour "${searchQuery}"` : 'Tendances cette semaine' }}
          </h2>
        </div>

        <div v-if="isLoading && movies.length === 0" class="home__loading">
          <div class="home__spinner" />
        </div>

        <p v-else-if="!isLoading && movies.length === 0" class="home__empty">
          Aucun film trouvé.
        </p>

        <div v-else class="home__grid">
          <NuxtLink
            v-for="movie in movies"
            :key="movie.id"
            :to="`/movies/${movie.id}`"
            class="movie-card"
          >
            <div class="movie-card__poster">
              <img
                v-if="getImageUrl(movie.poster_path, 'w300')"
                :src="getImageUrl(movie.poster_path, 'w300')!"
                :alt="movie.title"
                class="movie-card__img"
                loading="lazy"
              />
              <div v-else class="movie-card__no-poster">
                <span>✦</span>
              </div>
              <div class="movie-card__rating">
                <span class="movie-card__rating-star">★</span>
                {{ movie.vote_average.toFixed(1) }}
              </div>
            </div>
            <div class="movie-card__info">
              <h3 class="movie-card__title">{{ movie.title }}</h3>
              <p class="movie-card__year">{{ movie.release_date?.slice(0, 4) ?? '—' }}</p>
            </div>
          </NuxtLink>
        </div>

        <div v-if="hasMorePages" class="home__load-more">
          <button class="home__load-more-btn" :disabled="isLoading" @click="loadMore">
            {{ isLoading ? 'Chargement…' : 'Voir plus' }}
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import type { Movie } from '~/types/movie'

const { fetchTrending, searchMovies, getImageUrl } = useTmdb()

const searchQuery = ref('')
const movies = ref<Movie[]>([])
const isLoading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)

const isSearching = computed(() => searchQuery.value.trim().length > 0)
const hasMorePages = computed(() => currentPage.value < totalPages.value)

async function loadTrending() {
  isLoading.value = true
  const data = await fetchTrending('week')
  movies.value = data.results
  totalPages.value = data.total_pages
  isLoading.value = false
}

async function loadMore() {
  if (!hasMorePages.value || isLoading.value) return
  isLoading.value = true
  const nextPage = currentPage.value + 1
  const fetcher = isSearching.value
    ? searchMovies(searchQuery.value, nextPage)
    : fetchTrending('week')
  const data = await fetcher
  movies.value.push(...data.results)
  currentPage.value = nextPage
  isLoading.value = false
}

const doSearch = useDebounceFn(async (query: string) => {
  if (!query.trim()) {
    currentPage.value = 1
    totalPages.value = 1
    return loadTrending()
  }
  isLoading.value = true
  const data = await searchMovies(query)
  movies.value = data.results
  currentPage.value = 1
  totalPages.value = data.total_pages
  isLoading.value = false
}, 400)

function onSearchInput() {
  movies.value = []
  currentPage.value = 1
  doSearch(searchQuery.value)
}

function clearSearch() {
  searchQuery.value = ''
  movies.value = []
  currentPage.value = 1
  loadTrending()
}

await loadTrending()
</script>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.home {
  min-height: 100vh;

  &__hero {
    background: linear-gradient(180deg, rgba($color-primary, 0.08) 0%, transparent 100%);
    border-bottom: 1px solid $color-border;
    padding: 3rem 2rem 2.5rem;
  }

  &__hero-inner {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  &__title {
    font-size: 2rem;
    font-weight: 700;
    color: $color-text;
    text-align: center;
    letter-spacing: 0.02em;
  }

  &__search {
    position: relative;
    width: 100%;
    max-width: 560px;
  }

  &__search-input {
    width: 100%;
    padding: 0.875rem 3rem 0.875rem 1.25rem;
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: $border-radius-lg;
    color: $color-text;
    font-size: 1rem;
    outline: none;
    transition: border-color $transition-base, box-shadow $transition-base;

    &::placeholder {
      color: $color-text-muted;
    }

    &:focus {
      border-color: $color-primary;
      box-shadow: 0 0 0 3px rgba($color-primary, 0.15);
    }
  }

  &__search-clear {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: $color-text-muted;
    cursor: pointer;
    font-size: 0.875rem;
    padding: 0.25rem;
    transition: color $transition-base;

    &:hover {
      color: $color-text;
    }
  }

  &__content {
    padding: 2.5rem 2rem;
  }

  &__content-inner {
    max-width: 1400px;
    margin: 0 auto;
  }

  &__section-header {
    margin-bottom: 1.5rem;
  }

  &__section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: $color-text;
  }

  &__loading {
    display: flex;
    justify-content: center;
    padding: 4rem 0;
  }

  &__spinner {
    width: 2.5rem;
    height: 2.5rem;
    border: 3px solid $color-border;
    border-top-color: $color-primary;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  &__empty {
    text-align: center;
    color: $color-text-muted;
    padding: 4rem 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1.5rem;
  }

  &__load-more {
    display: flex;
    justify-content: center;
    margin-top: 2.5rem;
  }

  &__load-more-btn {
    padding: 0.75rem 2rem;
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: $border-radius-md;
    color: $color-text;
    font-size: 0.9rem;
    cursor: pointer;
    transition: border-color $transition-base, background $transition-base;

    &:hover:not(:disabled) {
      border-color: $color-primary;
      background: $color-surface-elevated;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.movie-card {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: transform $transition-base;

  &:hover {
    transform: translateY(-4px);

    .movie-card__img {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    }
  }

  &__poster {
    position: relative;
    aspect-ratio: 2 / 3;
    border-radius: $border-radius-md;
    overflow: hidden;
    background: $color-surface;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: box-shadow $transition-base;
  }

  &__no-poster {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: $color-text-muted;
  }

  &__rating {
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    background: rgba($color-background, 0.85);
    backdrop-filter: blur(4px);
    border-radius: $border-radius-sm;
    padding: 0.2rem 0.45rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: $color-text;
    display: flex;
    align-items: center;
    gap: 0.2rem;
  }

  &__rating-star {
    color: $color-accent;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  &__title {
    font-size: 0.875rem;
    font-weight: 600;
    color: $color-text;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__year {
    font-size: 0.75rem;
    color: $color-text-muted;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
