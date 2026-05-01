<template>
  <section class="relative z-[1] bg-background border-t border-border py-10 px-8">
    <div class="max-w-[1100px] mx-auto">
      <h2 class="text-lg font-semibold text-text-base mb-6">{{ $t('movie.cast') }}</h2>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-5">
        <CastCard v-for="member in cast" :key="member.id" :member="member" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CastMember } from '~/types/movie'

defineProps<{
  cast: CastMember[]
}>()
</script>
