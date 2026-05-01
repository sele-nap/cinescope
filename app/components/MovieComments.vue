<template>
  <section class="relative z-[1] max-w-[1100px] mx-auto px-8 pb-16 bg-background">
    <h2 class="text-lg font-semibold text-text-base mb-6">{{ $t('comments.title') }}</h2>

    <CommentForm @submitted="onCommentSubmitted" />

    <div v-if="comments.length" class="flex flex-col gap-4">
      <CommentItem v-for="comment in comments" :key="comment.id" :comment="comment" />
    </div>
    <p v-else class="text-sm text-text-muted text-center py-8">
      {{ $t('comments.empty') }}
    </p>
  </section>
</template>

<script setup lang="ts">
import type { CommentFormData } from '~/types/comment'

const props = defineProps<{ movieId: number }>()

const commentsStore = useCommentsStore()

const comments = computed(() => commentsStore.getCommentsByMovieId(props.movieId))

function onCommentSubmitted(data: CommentFormData): void {
  commentsStore.addComment(props.movieId, {
    id: crypto.randomUUID(),
    movieId: props.movieId,
    ...data,
    createdAt: new Date().toISOString(),
  })
}
</script>
