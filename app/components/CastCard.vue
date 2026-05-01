<template>
  <div class="flex flex-col gap-1 text-center">
    <div
      class="aspect-square w-full rounded-full overflow-hidden bg-surface flex items-center justify-center mb-1"
    >
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="member.name"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <span v-else class="text-2xl text-moon/35">✦</span>
    </div>
    <p class="text-[0.78rem] font-semibold text-text-base leading-tight">{{ member.name }}</p>
    <p class="text-[0.72rem] text-text-muted leading-tight">{{ member.character }}</p>
  </div>
</template>

<script setup lang="ts">
import type { CastMember } from '~/types/movie'

const props = defineProps<{
  member: CastMember
}>()

const { getImageUrl } = useTmdb()

const imageUrl = computed<string | null>(() => getImageUrl(props.member.profile_path, 'w200'))
</script>
