<template>
  <article class="bg-surface border border-border rounded-xl px-5 py-4 flex flex-col gap-2.5">
    <div class="flex items-center gap-3 flex-wrap">
      <span class="font-semibold text-sm text-text-base">{{ comment.username }}</span>
      <span class="text-xs font-semibold text-moon">★ {{ comment.rating }}/10</span>
      <time class="text-xs text-text-muted ml-auto">{{ formattedDate }}</time>
    </div>
    <div class="text-sm leading-relaxed text-text-base/85 comment-body" v-html="sanitizedMessage" />
  </article>
</template>

<script setup lang="ts">
import DOMPurify from 'dompurify'
import type { Comment } from '~/types/comment'

const props = defineProps<{ comment: Comment }>()

const { locale } = useI18n()

const sanitizedMessage = computed<string>(() => {
  if (!import.meta.client) return ''
  return DOMPurify.sanitize(props.comment.message, {
    ALLOWED_TAGS: ['p', 'strong', 'em', 'ul', 'ol', 'li', 'br'],
  })
})

const formattedDate = computed<string>(() =>
  new Intl.DateTimeFormat(locale.value, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(props.comment.createdAt)),
)
</script>

<style scoped>
.comment-body :deep(p) {
  margin: 0 0 0.4rem;
}
.comment-body :deep(ul) {
  list-style: disc;
  padding-left: 1.25rem;
  margin: 0 0 0.4rem;
}
.comment-body :deep(ol) {
  list-style: decimal;
  padding-left: 1.25rem;
  margin: 0 0 0.4rem;
}
.comment-body :deep(strong) {
  font-weight: 600;
}
.comment-body :deep(em) {
  font-style: italic;
}
</style>
