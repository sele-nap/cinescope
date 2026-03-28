<template>
  <section class="comments">
    <h2 class="comments__title">{{ $t('comments.title') }}</h2>

    <form class="comments__form" novalidate @submit.prevent="submitComment">
      <div class="comments__field">
        <label class="comments__label" for="username">{{ $t('comments.username') }}</label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          class="comments__input"
          :class="{ 'comments__input--error': v$.username.$error }"
          :placeholder="$t('comments.username_placeholder')"
          @blur="v$.username.$touch()"
        />
        <span v-if="v$.username.$error" class="comments__error">
          {{ v$.username.$errors[0]?.$message }}
        </span>
      </div>

      <div class="comments__field">
        <label class="comments__label">{{ $t('comments.message') }}</label>
        <ClientOnly>
          <div
            class="comments__editor-wrap"
            :class="{ 'comments__editor-wrap--error': v$.messageText.$error }"
          >
            <Editor
              v-model="form.message"
              tinymce-script-src="/tinymce/tinymce.min.js"
              :init="editorInit"
              @blur="v$.messageText.$touch()"
            />
          </div>
          <template #fallback>
            <textarea
              v-model="form.message"
              class="comments__textarea"
              :placeholder="$t('comments.message_placeholder')"
              rows="4"
            />
          </template>
        </ClientOnly>
        <div class="comments__field-footer">
          <span v-if="v$.messageText.$error" class="comments__error">
            {{ v$.messageText.$errors[0]?.$message }}
          </span>
          <span
            class="comments__char-count"
            :class="{ 'comments__char-count--warn': messageText.length > 450 }"
          >
            {{ messageText.length }}/500
          </span>
        </div>
      </div>

      <div class="comments__field">
        <label class="comments__label">
          {{ $t('comments.rating') }}
          <span v-if="form.rating > 0" class="comments__rating-value">{{ form.rating }}/10</span>
        </label>
        <div class="comments__stars" @blur="v$.rating.$touch()">
          <button
            v-for="n in 10"
            :key="n"
            type="button"
            class="comments__star"
            :class="{ 'comments__star--active': n <= form.rating }"
            @click="form.rating = n; v$.rating.$touch()"
          >★</button>
        </div>
        <span v-if="v$.rating.$error" class="comments__error">
          {{ v$.rating.$errors[0]?.$message }}
        </span>
      </div>

      <button type="submit" class="comments__submit" :disabled="isSubmitting">
        {{ isSubmitting ? $t('comments.submitting') : $t('comments.submit') }}
      </button>
    </form>

    <div v-if="comments.length" class="comments__list">
      <article v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-item__header">
          <span class="comment-item__username">{{ comment.username }}</span>
          <span class="comment-item__rating">★ {{ comment.rating }}/10</span>
          <time class="comment-item__date">{{ formatDate(comment.createdAt) }}</time>
        </div>
        <div class="comment-item__message" v-html="comment.message" />
      </article>
    </div>

    <p v-else class="comments__empty">{{ $t('comments.empty') }}</p>
  </section>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, maxLength, helpers, between } from '@vuelidate/validators'
import { useCommentsStore } from '~/stores/comments'

const Editor = defineAsyncComponent(() => import('@tinymce/tinymce-vue'))

const { t, locale } = useI18n()

const props = defineProps<{ movieId: number }>()

const commentsStore = useCommentsStore()

onMounted(() => commentsStore.loadFromStorage())

const comments = computed(() => commentsStore.getCommentsByMovieId(props.movieId))

const form = reactive({
  username: '',
  message: '',
  rating: 0,
})

const isSubmitting = ref(false)

// Texte brut (sans balises HTML ni entités HTML) utilisé pour la validation et le compteur de caractères
const messageText = computed(() =>
  form.message
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, '')
    .trim(),
)

const editorInit = {
  height: 200,
  menubar: false,
  plugins: ['lists'],
  toolbar: 'bold italic | bullist numlist | removeformat',
  skin: 'oxide-dark',
  content_css: 'dark',
  content_style: `
    body {
      background-color: #0d0a15;
      color: #efe9e0;
      font-family: inherit;
      font-size: 15px;
      padding: 8px 12px;
      margin: 0;
    }
  `,
  branding: false,
  statusbar: false,
  resize: false,
}

// Validateur personnalisé : lettres uniquement, accents inclus (é, è, à, É…)
const alphaFr = helpers.withMessage(
  () => t('validation.alpha_only'),
  (value: unknown) => {
    if (typeof value !== 'string') return false
    return /^[A-Za-zÀ-ÖØ-öø-ÿ]+$/.test(value)
  },
)

// Validateur pour le message : lettres, chiffres, ponctuation courante
const alphaNumFr = helpers.withMessage(
  () => t('validation.alpha_num'),
  (value: unknown) => {
    if (typeof value !== 'string' || value.trim() === '') return true
    return /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,!?()\-'"]+$/.test(value)
  },
)

const rules = {
  username: {
    required: helpers.withMessage(() => t('validation.required'), required),
    alphaFr,
    minLength: helpers.withMessage(() => t('validation.min_length', { min: 3 }), minLength(3)),
    maxLength: helpers.withMessage(() => t('validation.max_length', { max: 50 }), maxLength(50)),
  },
  messageText: {
    required: helpers.withMessage(() => t('validation.required'), (value: unknown) =>
      typeof value === 'string' && value.trim().length > 0,
    ),
    alphaNumFr,
    minLength: helpers.withMessage(() => t('validation.min_length', { min: 3 }), minLength(3)),
    maxLength: helpers.withMessage(() => t('validation.max_length', { max: 500 }), maxLength(500)),
  },
  rating: {
    between: helpers.withMessage(() => t('validation.rating_required'), between(1, 10)),
  },
}

const v$ = useVuelidate(rules, { username: toRef(form, 'username'), messageText, rating: toRef(form, 'rating') })

async function submitComment() {
  const valid = await v$.value.$validate()
  if (!valid) return

  isSubmitting.value = true

  commentsStore.addComment(props.movieId, {
    id: crypto.randomUUID(),
    movieId: props.movieId,
    username: form.username,
    message: form.message,
    rating: form.rating,
    createdAt: new Date().toISOString(),
  })

  form.username = ''
  form.message = ''
  form.rating = 0
  v$.value.$reset()
  isSubmitting.value = false
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(locale.value, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso))
}
</script>

<style lang="scss" scoped>
@use '~/assets/styles/variables' as *;

.comments {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 2rem 4rem;
  background: $color-background;

  &__title {
    font-size: 1.1rem;
    font-weight: 600;
    color: $color-text;
    margin-bottom: 1.5rem;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: $border-radius-lg;
    padding: 1.5rem;
    margin-bottom: 2.5rem;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  &__label {
    font-size: 0.82rem;
    font-weight: 600;
    color: $color-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__input,
  &__textarea {
    background: $color-background;
    border: 1px solid $color-border;
    border-radius: $border-radius-md;
    color: $color-text;
    font-size: 0.95rem;
    padding: 0.75rem 1rem;
    outline: none;
    resize: vertical;
    transition: border-color $transition-base, box-shadow $transition-base;
    font-family: inherit;

    &::placeholder {
      color: $color-text-muted;
    }

    &:focus {
      border-color: $color-primary;
      box-shadow: 0 0 0 3px rgba($color-primary, 0.15);
    }

    &--error {
      border-color: $color-error !important;
      box-shadow: 0 0 0 3px rgba($color-error, 0.15) !important;
    }
  }

  &__editor-wrap {
    border: 1px solid $color-border;
    border-radius: $border-radius-md;
    overflow: hidden;
    transition: border-color $transition-base, box-shadow $transition-base;

    &:focus-within {
      border-color: $color-primary;
      box-shadow: 0 0 0 3px rgba($color-primary, 0.15);
    }

    &--error {
      border-color: $color-error !important;
      box-shadow: 0 0 0 3px rgba($color-error, 0.15) !important;
    }

    :deep(.tox-tinymce) {
      border: none;
      border-radius: 0;
    }

    :deep(.tox:not(.tox-tinymce-inline) .tox-editor-header) {
      background: $color-surface-elevated;
      border-bottom: 1px solid $color-border;
      box-shadow: none;
    }

    :deep(.tox .tox-toolbar__primary) {
      background: $color-surface-elevated;
    }

    :deep(.tox .tox-tbtn) {
      color: $color-text-muted;

      &:hover {
        background: rgba($color-primary, 0.1);
        color: $color-text;
      }
    }

    :deep(.tox .tox-tbtn--enabled) {
      background: rgba($color-primary, 0.15);
      color: $color-primary;
    }
  }

  &__field-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 1.2rem;
  }

  &__error {
    font-size: 0.78rem;
    color: $color-error;
  }

  &__char-count {
    font-size: 0.75rem;
    color: $color-text-muted;
    margin-left: auto;

    &--warn {
      color: $color-warning;
    }
  }

  &__rating-value {
    font-weight: 700;
    color: $color-moon;
    text-transform: none;
    letter-spacing: 0;
  }

  &__stars {
    display: flex;
    gap: 0.2rem;
  }

  &__star {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: rgba($color-moon, 0.2);
    cursor: pointer;
    padding: 0;
    transition: color $transition-base, transform $transition-base;

    &--active {
      color: $color-moon;
      filter: drop-shadow(0 0 4px rgba($color-moon, 0.4));
    }

    &:hover {
      transform: scale(1.2);
    }
  }

  &__submit {
    align-self: flex-start;
    padding: 0.7rem 1.75rem;
    background: $color-primary;
    border: none;
    border-radius: $border-radius-md;
    color: #fff;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: background $transition-base, opacity $transition-base;

    &:hover:not(:disabled) {
      background: $color-primary-dark;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__empty {
    color: $color-text-muted;
    font-size: 0.9rem;
    text-align: center;
    padding: 2rem 0;
  }
}

.comment-item {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $border-radius-md;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  &__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  &__username {
    font-weight: 600;
    font-size: 0.9rem;
    color: $color-text;
  }

  &__rating {
    font-size: 0.82rem;
    font-weight: 600;
    color: $color-moon;
  }

  &__date {
    font-size: 0.78rem;
    color: $color-text-muted;
    margin-left: auto;
  }

  &__message {
    font-size: 0.9rem;
    line-height: 1.6;
    color: $color-text;
    opacity: 0.85;

    :deep(p) { margin: 0 0 0.4rem; }

    :deep(ul) {
      list-style: disc;
      padding-left: 1.25rem;
      margin: 0 0 0.4rem;
    }

    :deep(ol) {
      list-style: decimal;
      padding-left: 1.25rem;
      margin: 0 0 0.4rem;
    }
    :deep(strong) { font-weight: 600; }
    :deep(em) { font-style: italic; }
  }
}
</style>
