<template>
  <NuxtLink
    :to="`/movies/${movie.id}`"
    :style="animationDelay ? { animationDelay } : undefined"
    class="group flex flex-col gap-3 no-underline text-inherit animate-card-in hover:-translate-y-1 transition-transform duration-200"
  >
    <div class="relative aspect-[2/3] rounded-2xl overflow-hidden bg-surface">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="movie.title"
        class="w-full h-full object-cover transition-shadow duration-200 group-hover:shadow-[0_8px_24px_rgb(0_0_0/0.5)]"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-4xl text-moon/30">
        ✦
      </div>

      <div
        class="absolute bottom-2 right-2 flex items-center gap-1 bg-background/[0.88] backdrop-blur-[6px] border border-moon/[0.12] rounded-md px-2 py-0.5 text-xs font-semibold text-text-base"
      >
        <span class="text-moon text-[0.8rem]">★</span>
        {{ movie.vote_average.toFixed(1) }}
      </div>
    </div>

    <div class="flex flex-col gap-0.5">
      <h3 class="text-sm font-semibold text-text-base leading-[1.3] line-clamp-2">
        {{ movie.title }}
      </h3>
      <p class="text-xs text-text-muted">{{ movie.release_date?.slice(0, 4) ?? '—' }}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Movie } from '~/types/movie'

const props = defineProps<{
  movie: Movie
  animationDelay?: string
}>()

const { getImageUrl } = useTmdb()

const imageUrl = computed<string | null>(() => getImageUrl(props.movie.poster_path, 'w300'))
</script>
