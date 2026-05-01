<template>
  <main class="min-h-screen relative">
    <MovieDetailSkeleton v-if="pending" />

    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p class="text-error text-sm">{{ $t('movie.error') }}</p>
      <button
        class="px-6 py-2 border border-border rounded-xl text-text-muted text-sm cursor-pointer bg-transparent transition-colors duration-200 hover:text-text-base hover:border-text-muted"
        @click="router.back()"
      >
        {{ $t('movie.back') }}
      </button>
    </div>

    <template v-else-if="movie">
      <!-- Bouton retour -->
      <div class="relative z-[2] max-w-[1100px] mx-auto px-8 pt-5">
        <button
          class="inline-flex items-center gap-2 bg-surface/70 border border-moon/[0.12] rounded-xl backdrop-blur-md text-text-muted text-sm font-medium cursor-pointer px-4 py-2 transition-all duration-200 hover:text-text-base hover:border-moon/30 hover:bg-surface-elevated/85 hover:-translate-x-0.5"
          @click="router.back()"
        >
          <span class="text-base leading-none">←</span>
          {{ $t('movie.back') }}
        </button>
      </div>

      <!-- Backdrop -->
      <div class="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <img
          v-if="backdropUrl"
          :src="backdropUrl"
          :alt="movie.title"
          class="w-full h-full object-cover opacity-[0.12]"
        />
        <div
          class="absolute inset-0"
          style="background: linear-gradient(to bottom, rgb(14 12 26 / 0.4) 0%, #0e0c1a 70%)"
        />
      </div>

      <!-- Infos du film -->
      <div class="relative z-[1] max-w-[1100px] mx-auto px-8 py-12 grid grid-cols-[260px_1fr] gap-12 max-[700px]:grid-cols-1 max-[700px]:px-4 max-[700px]:py-8">
        <!-- Poster -->
        <div>
          <img
            v-if="posterUrl"
            :src="posterUrl"
            :alt="movie.title"
            class="w-full rounded-2xl shadow-[0_8px_32px_rgb(0_0_0/0.6)]"
          />
          <div
            v-else
            class="w-full aspect-[2/3] rounded-2xl bg-surface flex items-center justify-center text-6xl text-moon/30 border border-moon/[0.08]"
          >
            ✦
          </div>
        </div>

        <!-- Détails -->
        <div class="flex flex-col gap-5 pt-2">
          <h1 class="text-3xl font-bold text-text-base leading-tight">{{ movie.title }}</h1>

          <p v-if="movie.tagline" class="text-base text-accent italic">{{ movie.tagline }}</p>

          <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1 bg-moon/[0.06] border border-moon/25 rounded-xl text-sm text-moon font-medium">
              ✦ {{ movie.vote_average.toFixed(1) }}
              <span class="font-normal text-text-muted text-xs">
                {{ $t('movie.votes', { count: movie.vote_count.toLocaleString() }) }}
              </span>
            </span>
            <span class="px-3 py-1 bg-surface/80 border border-moon/[0.12] rounded-xl text-sm text-text-base font-medium">
              {{ movie.release_date?.slice(0, 4) ?? '—' }}
            </span>
            <span
              v-if="movie.runtime"
              class="px-3 py-1 bg-surface/80 border border-moon/[0.12] rounded-xl text-sm text-text-base font-medium"
            >
              {{ formatRuntime(movie.runtime) }}
            </span>
            <span
              v-if="movie.status"
              class="px-3 py-1 bg-surface/80 border border-moon/[0.12] rounded-xl text-sm text-text-muted font-medium"
            >
              {{ movie.status }}
            </span>
          </div>

          <div v-if="movie.genres?.length" class="flex flex-wrap gap-2">
            <span
              v-for="genre in movie.genres"
              :key="genre.id"
              class="px-4 py-1 bg-moon/[0.06] border border-moon/20 rounded-full text-xs text-moon"
            >
              {{ genre.name }}
            </span>
          </div>

          <p v-if="movie.overview" class="text-[0.95rem] leading-[1.7] text-text-base opacity-85">
            {{ movie.overview }}
          </p>

          <div v-if="director" class="flex flex-col gap-1">
            <span class="text-xs uppercase tracking-[0.08em] text-text-muted">{{ $t('movie.director') }}</span>
            <span class="text-[0.95rem] font-semibold text-text-base">{{ director.name }}</span>
          </div>
        </div>
      </div>

      <CastSection v-if="cast.length" :cast="cast" />
      <MovieComments :movie-id="id" />
    </template>
  </main>
</template>

<script setup lang="ts">
import type { CastMember, CrewMember } from '~/types/movie'

const { locale } = useI18n()
const route = useRoute()
const router = useRouter()
const { fetchMovieDetails, fetchMovieCredits, getImageUrl } = useTmdb()

const id = Number(route.params.id)

const { data: movie, pending, error, refresh: refreshMovie } = await useAsyncData(
  `movie-${id}`,
  () => fetchMovieDetails(id),
)
const { data: credits, refresh: refreshCredits } = await useAsyncData(
  `credits-${id}`,
  () => fetchMovieCredits(id),
)

watch(locale, (): void => {
  refreshMovie()
  refreshCredits()
})

const cast = computed<CastMember[]>(() => credits.value?.cast.slice(0, 12) ?? [])
const director = computed<CrewMember | null>(() => credits.value?.crew.find(m => m.job === 'Director') ?? null)
const posterUrl = computed<string | null>(() => movie.value ? getImageUrl(movie.value.poster_path, 'w500') : null)
const backdropUrl = computed<string | null>(() => movie.value ? getImageUrl(movie.value.backdrop_path, 'original') : null)

function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${m}min`
}

useSeoMeta({
  title: () => movie.value ? `${movie.value.title} — Cinescope` : 'Cinescope',
})

onMounted((): void => window.scrollTo({ top: 0, behavior: 'instant' }))
</script>
