<template>
  <main class="min-h-screen">
    <section
      class="border-b border-border/10 px-8 py-12"
      style="background: linear-gradient(180deg, rgb(214 201 176 / 0.05) 0%, rgb(160 122 212 / 0.06) 50%, transparent 100%)"
    >
      <div class="max-w-[1400px] mx-auto flex flex-col items-center gap-6">
        <h1 class="text-3xl font-bold text-text-base text-center tracking-[0.02em]">
          {{ $t('home.title') }}
        </h1>
        <SearchBar
          v-model="searchQuery"
          :placeholder="$t('home.search_placeholder')"
          @input="onSearchInput"
          @clear="clearSearch"
        />
      </div>
    </section>

    <section class="px-8 py-10">
      <div class="max-w-[1400px] mx-auto">
        <h2 class="text-xl font-semibold text-text-base mb-6">
          {{ isSearching ? $t('home.results_for', { query: searchQuery }) : $t('home.trending') }}
        </h2>

        <div v-if="isLoading && movies.length === 0" class="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-6">
          <MovieCardSkeleton v-for="n in 20" :key="n" />
        </div>

        <div v-else-if="apiError" class="flex flex-col items-center py-16 gap-4">
          <p class="text-error text-center">{{ $t(apiError) }}</p>
          <button
            class="px-6 py-2 border border-border rounded-xl text-text-muted text-sm cursor-pointer bg-transparent transition-colors duration-200 hover:text-text-base hover:border-text-muted"
            @click="retry"
          >
            Réessayer
          </button>
        </div>

        <p v-else-if="!isLoading && movies.length === 0" class="text-center text-text-muted py-16">
          {{ $t('home.no_results') }}
        </p>

        <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-6">
          <MovieCard
            v-for="(movie, index) in movies"
            :key="movie.id"
            :movie="movie"
            :animation-delay="`${(index % 20) * 40}ms`"
          />
        </div>

        <div ref="sentinel" class="flex justify-center py-8 min-h-px">
          <div
            v-if="isLoading && movies.length > 0"
            class="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin"
          />
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useDebounceFn, useIntersectionObserver } from '@vueuse/core'
import type { Movie } from '~/types/movie'

const { locale } = useI18n()
const { fetchTrending, searchMovies } = useTmdb()

const searchQuery = ref<string>('')
const movies = ref<Movie[]>([])
const isLoading = ref<boolean>(false)
const apiError = ref<string | null>(null)
const currentPage = ref<number>(1)
const totalPages = ref<number>(1)
const sentinel = ref<HTMLElement | null>(null)

const isSearching = computed<boolean>(() => searchQuery.value.trim().length > 0)
const hasMorePages = computed<boolean>(() => currentPage.value < totalPages.value)

async function loadTrending(): Promise<void> {
  isLoading.value = true
  apiError.value = null
  try {
    const data = await fetchTrending('week')
    movies.value = data.results
    totalPages.value = data.total_pages
    currentPage.value = 1
  }
  catch {
    apiError.value = 'home.error'
  }
  finally {
    isLoading.value = false
  }
}

async function loadMore(): Promise<void> {
  if (!hasMorePages.value || isLoading.value) return
  isLoading.value = true
  try {
    const nextPage = currentPage.value + 1
    const data = await (isSearching.value
      ? searchMovies(searchQuery.value, nextPage)
      : fetchTrending('week', nextPage))
    movies.value.push(...data.results)
    currentPage.value = nextPage
  }
  catch {
    apiError.value = 'home.error'
  }
  finally {
    isLoading.value = false
  }
}

function retry(): void {
  if (isSearching.value) doSearch(searchQuery.value)
  else loadTrending()
}

useIntersectionObserver(sentinel, ([entry]) => {
  if (entry?.isIntersecting) loadMore()
}, { rootMargin: '300px' })

const doSearch = useDebounceFn(async (query: string): Promise<void> => {
  if (!query.trim()) {
    currentPage.value = 1
    totalPages.value = 1
    return loadTrending()
  }
  isLoading.value = true
  apiError.value = null
  try {
    const data = await searchMovies(query)
    movies.value = data.results
    currentPage.value = 1
    totalPages.value = data.total_pages
  }
  catch {
    apiError.value = 'home.error'
  }
  finally {
    isLoading.value = false
  }
}, 400)

function onSearchInput(value: string): void {
  movies.value = []
  currentPage.value = 1
  doSearch(value)
}

function clearSearch(): void {
  movies.value = []
  currentPage.value = 1
  loadTrending()
}

watch(locale, async (): Promise<void> => {
  movies.value = []
  currentPage.value = 1
  if (isSearching.value) {
    isLoading.value = true
    apiError.value = null
    try {
      const data = await searchMovies(searchQuery.value)
      movies.value = data.results
      totalPages.value = data.total_pages
    }
    catch {
      apiError.value = 'home.error'
    }
    finally {
      isLoading.value = false
    }
  }
  else {
    await loadTrending()
  }
})

const savedScrollY = ref<number | null>(null)

onBeforeRouteLeave((): void => {
  savedScrollY.value = window.scrollY
})

onActivated((): void => {
  if (savedScrollY.value === null) return
  const y = savedScrollY.value
  nextTick(() => window.scrollTo({ top: y, behavior: 'instant' }))
  setTimeout(() => window.scrollTo({ top: y, behavior: 'instant' }), 200)
})

onMounted(() => loadTrending())
</script>
