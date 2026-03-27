<template>
  <section class="comments">
    <h2 class="comments__title">Commentaires</h2>

    <form class="comments__form" novalidate @submit.prevent="submitComment">
      <div class="comments__field">
        <label class="comments__label" for="username">Nom d'utilisateur</label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          class="comments__input"
          :class="{ 'comments__input--error': v$.username.$error }"
          placeholder="VotreNom"
          @blur="v$.username.$touch()"
        />
        <span v-if="v$.username.$error" class="comments__error">
          {{ v$.username.$errors[0].$message }}
        </span>
      </div>

      <div class="comments__field">
        <label class="comments__label" for="message">Message</label>
        <textarea
          id="message"
          v-model="form.message"
          class="comments__textarea"
          :class="{ 'comments__input--error': v$.message.$error }"
          placeholder="Votre avis sur ce film..."
          rows="4"
          @blur="v$.message.$touch()"
        />
        <div class="comments__field-footer">
          <span v-if="v$.message.$error" class="comments__error">
            {{ v$.message.$errors[0].$message }}
          </span>
          <span class="comments__char-count" :class="{ 'comments__char-count--warn': form.message.length > 450 }">
            {{ form.message.length }}/500
          </span>
        </div>
      </div>

      <div class="comments__field">
        <label class="comments__label">Note <span class="comments__rating-value">{{ form.rating }}/10</span></label>
        <div class="comments__stars">
          <button
            v-for="n in 10"
            :key="n"
            type="button"
            class="comments__star"
            :class="{ 'comments__star--active': n <= form.rating }"
            @click="form.rating = n"
          >★</button>
        </div>
      </div>

      <button type="submit" class="comments__submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Envoi…' : 'Publier' }}
      </button>
    </form>

    <div v-if="comments.length" class="comments__list">
      <article v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-item__header">
          <span class="comment-item__username">{{ comment.username }}</span>
          <span class="comment-item__rating">★ {{ comment.rating }}/10</span>
          <time class="comment-item__date">{{ formatDate(comment.createdAt) }}</time>
        </div>
        <p class="comment-item__message">{{ comment.message }}</p>
      </article>
    </div>

    <p v-else class="comments__empty">Aucun commentaire pour l'instant. Soyez le premier !</p>
  </section>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, maxLength, helpers, alpha, alphaNum } from '@vuelidate/validators'
import { useCommentsStore } from '~/stores/comments'

const props = defineProps<{ movieId: number }>()

const commentsStore = useCommentsStore()

onMounted(() => commentsStore.loadFromStorage())

const comments = computed(() => commentsStore.getCommentsByMovieId(props.movieId))

const form = reactive({
  username: '',
  message: '',
  rating: 5,
})

const isSubmitting = ref(false)

const rules = {
  username: {
    required: helpers.withMessage('Champ requis', required),
    alpha: helpers.withMessage('Uniquement des lettres', alpha),
    minLength: helpers.withMessage('3 caractères minimum', minLength(3)),
    maxLength: helpers.withMessage('50 caractères maximum', maxLength(50)),
  },
  message: {
    required: helpers.withMessage('Champ requis', required),
    alphaNum: helpers.withMessage('Uniquement des lettres et chiffres', alphaNum),
    minLength: helpers.withMessage('3 caractères minimum', minLength(3)),
    maxLength: helpers.withMessage('500 caractères maximum', maxLength(500)),
  },
}

const v$ = useVuelidate(rules, form)

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
  form.rating = 5
  v$.value.$reset()
  isSubmitting.value = false
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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
    color: $color-accent;
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
    color: $color-border;
    cursor: pointer;
    padding: 0;
    transition: color $transition-base, transform $transition-base;

    &--active {
      color: $color-accent;
    }

    &:hover {
      transform: scale(1.15);
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
    color: $color-accent;
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
    white-space: pre-wrap;
  }
}
</style>
