<template>
  <main class="home">
    <section class="home__hero">
      <div class="home__hero-inner">
        <h1 class="home__title">{{ $t('home.title') }}</h1>
        <div class="home__search">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('home.search_placeholder')"
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
            {{ isSearching ? $t('home.results_for', { query: searchQuery }) : $t('home.trending') }}
          </h2>
        </div>

        <div v-if="isLoading && movies.length === 0" class="home__grid">
          <v-skeleton-loader
            v-for="n in 20"
            :key="n"
            type="image,list-item-two-line"
            color="transparent"
            class="movie-card-skeleton"
          />
        </div>

        <p v-else-if="!isLoading && movies.length === 0" class="home__empty">
          {{ $t('home.no_results') }}
        </p>

        <div v-else class="home__grid">
          <NuxtLink
            v-for="(movie, index) in movies"
            :key="movie.id"
            :to="`/movies/${movie.id}`"
            :style="{ animationDelay: `${(index % 20) * 40}ms` }"
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

        <div ref="sentinel" class="home__sentinel">
          <div v-if="isLoading && movies.length > 0" class="home__spinner home__spinner--inline" />
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useDebounceFn, useIntersectionObserver } from '@vueuse/core'
import type { Movie } from '~/types/movie'

const { t, locale } = useI18n()
const { fetchTrending, searchMovies, getImageUrl } = useTmdb()

const searchQuery = ref('')
const movies = ref<Movie[]>([])
const isLoading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)

const sentinel = ref<HTMLElement | null>(null)

const isSearching = computed(() => searchQuery.value.trim().length > 0)
const hasMorePages = computed(() => currentPage.value < totalPages.value)

async function loadTrending() {
  isLoading.value = true
  const data = await fetchTrending('week')
  movies.value = data.results
  totalPages.value = data.total_pages
  currentPage.value = 1
  isLoading.value = false
}

async function loadMore() {
  if (!hasMorePages.value || isLoading.value) return
  isLoading.value = true
  const nextPage = currentPage.value + 1
  const data = await (isSearching.value
    ? searchMovies(searchQuery.value, nextPage)
    : fetchTrending('week', nextPage))
  movies.value.push(...data.results)
  currentPage.value = nextPage
  isLoading.value = false
}

useIntersectionObserver(sentinel, ([entry]) => {
  if (entry.isIntersecting) loadMore()
}, { rootMargin: '300px' })

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

watch(locale, async () => {
  movies.value = []
  currentPage.value = 1
  if (isSearching.value) {
    isLoading.value = true
    const data = await searchMovies(searchQuery.value)
    movies.value = data.results
    totalPages.value = data.total_pages
    isLoading.value = false
  } else {
    await loadTrending()
  }
})

await loadTrending()
</script>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.home {
  min-height: 100vh;

  &__hero {
    background: linear-gradient(180deg, rgba($color-moon, 0.05) 0%, rgba($color-primary, 0.06) 50%, transparent 100%);
    border-bottom: 1px solid rgba($color-moon, 0.1);
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

  &__sentinel {
    display: flex;
    justify-content: center;
    padding: 2rem 0;
    min-height: 1px;
  }

  &__spinner--inline {
    width: 2rem;
    height: 2rem;
    border-width: 2px;
  }
}

.movie-card-skeleton {
  border-radius: $border-radius-md;
  overflow: hidden;
}

.movie-card {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: transform $transition-base;
  animation: card-in 0.35s ease both;

  &:hover {
    transform: translateY(-4px);

    .movie-card__img {
      box-shadow: 0 8px 24px rgb(0 0 0 / 50%);
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
    font-size: 2.5rem;
    color: rgba($color-moon, 0.3);
  }

  &__rating {
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    background: rgba($color-background, 0.88);
    backdrop-filter: blur(6px);
    border-radius: $border-radius-sm;
    padding: 0.2rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: $color-text;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    border: 1px solid rgba($color-moon, 0.12);
  }

  &__rating-star {
    color: $color-moon;
    font-size: 0.8rem;
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
  to { transform: rotate(360deg); }
}

@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
