<template>
  <main class="movie-detail">
    <div v-if="pending" class="movie-detail__loading">
      <div class="movie-detail__spinner" />
    </div>

    <template v-else-if="movie">
      <div class="movie-detail__nav">
        <button class="movie-detail__back" @click="router.back()">← Retour</button>
      </div>

      <div class="movie-detail__backdrop">
        <img
          v-if="getImageUrl(movie.backdrop_path, 'original')"
          :src="getImageUrl(movie.backdrop_path, 'original')!"
          :alt="movie.title"
          class="movie-detail__backdrop-img"
        />
        <div class="movie-detail__backdrop-overlay" />
      </div>

      <div class="movie-detail__content">
        <div class="movie-detail__poster-col">
          <img
            v-if="getImageUrl(movie.poster_path, 'w500')"
            :src="getImageUrl(movie.poster_path, 'w500')!"
            :alt="movie.title"
            class="movie-detail__poster"
          />
          <div v-else class="movie-detail__poster-placeholder">✦</div>
        </div>

        <div class="movie-detail__info">
          <h1 class="movie-detail__title">{{ movie.title }}</h1>

          <p v-if="movie.tagline" class="movie-detail__tagline">{{ movie.tagline }}</p>

          <div class="movie-detail__meta">
            <span class="movie-detail__badge">★ {{ movie.vote_average.toFixed(1) }} <span class="movie-detail__vote-count">({{ movie.vote_count.toLocaleString('fr-FR') }} votes)</span></span>
            <span class="movie-detail__badge">{{ movie.release_date?.slice(0, 4) ?? '—' }}</span>
            <span v-if="movie.runtime" class="movie-detail__badge">{{ formatRuntime(movie.runtime) }}</span>
            <span v-if="movie.status" class="movie-detail__badge movie-detail__badge--muted">{{ movie.status }}</span>
          </div>

          <div v-if="movie.genres?.length" class="movie-detail__genres">
            <span v-for="genre in movie.genres" :key="genre.id" class="movie-detail__genre">
              {{ genre.name }}
            </span>
          </div>

          <p v-if="movie.overview" class="movie-detail__overview">{{ movie.overview }}</p>

          <div v-if="director" class="movie-detail__director">
            <span class="movie-detail__director-label">Réalisateur·ice</span>
            <span class="movie-detail__director-name">{{ director.name }}</span>
          </div>
        </div>
      </div>

      <div v-if="cast.length" class="movie-detail__cast-section">
        <div class="movie-detail__cast-inner">
          <h2 class="movie-detail__cast-title">Casting</h2>
          <div class="movie-detail__cast-grid">
            <div v-for="member in cast" :key="member.id" class="cast-card">
              <div class="cast-card__avatar">
                <img
                  v-if="getImageUrl(member.profile_path, 'w200')"
                  :src="getImageUrl(member.profile_path, 'w200')!"
                  :alt="member.name"
                  class="cast-card__img"
                  loading="lazy"
                />
                <span v-else class="cast-card__placeholder">✦</span>
              </div>
              <p class="cast-card__name">{{ member.name }}</p>
              <p class="cast-card__character">{{ member.character }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </main>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { fetchMovieDetails, fetchMovieCredits, getImageUrl } = useTmdb()

const id = Number(route.params.id)

const { data: movie, pending } = await useAsyncData(`movie-${id}`, () => fetchMovieDetails(id))
const { data: credits } = await useAsyncData(`credits-${id}`, () => fetchMovieCredits(id))

const cast = computed(() => credits.value?.cast.slice(0, 12) ?? [])
const director = computed(() => credits.value?.crew.find((m) => m.job === 'Director') ?? null)

function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${m}min`
}

useSeoMeta({
  title: () => movie.value ? `${movie.value.title} — Cinescope` : 'Cinescope',
})
</script>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.movie-detail {
  min-height: 100vh;
  position: relative;

  &__nav {
    position: relative;
    z-index: 2;
    padding: 1.25rem 2rem 0;
    max-width: 1100px;
    margin: 0 auto;
  }

  &__back {
    background: none;
    border: none;
    color: $color-text-muted;
    font-size: 0.9rem;
    cursor: pointer;
    padding: 0.25rem 0;
    transition: color $transition-base;

    &:hover {
      color: $color-text;
    }
  }

  &__loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
  }

  &__spinner {
    width: 2.5rem;
    height: 2.5rem;
    border: 3px solid $color-border;
    border-top-color: $color-primary;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  &__backdrop {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  &__backdrop-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.12;
  }

  &__backdrop-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba($color-background, 0.4) 0%, $color-background 70%);
  }

  &__content {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 3rem 2rem;
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 3rem;

    @media (max-width: 700px) {
      grid-template-columns: 1fr;
      padding: 2rem 1rem;
    }
  }

  &__poster-col {
    display: flex;
    flex-direction: column;
  }

  &__poster {
    width: 100%;
    border-radius: $border-radius-lg;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  }

  &__poster-placeholder {
    width: 100%;
    aspect-ratio: 2 / 3;
    border-radius: $border-radius-lg;
    background: $color-surface;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: $color-text-muted;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding-top: 0.5rem;
  }

  &__title {
    font-size: 2rem;
    font-weight: 700;
    color: $color-text;
    line-height: 1.2;
  }

  &__tagline {
    font-size: 1rem;
    color: $color-accent;
    font-style: italic;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__badge {
    padding: 0.3rem 0.75rem;
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: $border-radius-sm;
    font-size: 0.85rem;
    color: $color-text;
    font-weight: 500;

    &--muted {
      color: $color-text-muted;
    }
  }

  &__vote-count {
    font-weight: 400;
    color: $color-text-muted;
    font-size: 0.8rem;
  }

  &__genres {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__genre {
    padding: 0.25rem 0.75rem;
    background: rgba($color-primary, 0.12);
    border: 1px solid rgba($color-primary, 0.3);
    border-radius: 999px;
    font-size: 0.8rem;
    color: $color-primary;
  }

  &__overview {
    font-size: 0.95rem;
    line-height: 1.7;
    color: $color-text;
    opacity: 0.85;
  }

  &__director {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  &__director-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: $color-text-muted;
  }

  &__director-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: $color-text;
  }

  &__cast-section {
    position: relative;
    z-index: 1;
    border-top: 1px solid $color-border;
    padding: 2.5rem 2rem;
  }

  &__cast-inner {
    max-width: 1100px;
    margin: 0 auto;
  }

  &__cast-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: $color-text;
    margin-bottom: 1.5rem;
  }

  &__cast-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 1.25rem;
  }
}

.cast-card {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  text-align: center;

  &__avatar {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 50%;
    overflow: hidden;
    background: $color-surface;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.25rem;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__placeholder {
    font-size: 1.5rem;
    color: $color-text-muted;
  }

  &__name {
    font-size: 0.78rem;
    font-weight: 600;
    color: $color-text;
    line-height: 1.3;
  }

  &__character {
    font-size: 0.72rem;
    color: $color-text-muted;
    line-height: 1.3;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
