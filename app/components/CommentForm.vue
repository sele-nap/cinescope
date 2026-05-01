<template>
  <form
    class="flex flex-col gap-5 bg-surface border border-border rounded-2xl p-6 mb-10"
    novalidate
    @submit.prevent="submit"
  >
    <!-- Nom d'utilisateur -->
    <div class="flex flex-col gap-1.5">
      <label
        class="text-[0.82rem] font-semibold text-text-muted uppercase tracking-[0.06em]"
        for="comment-username"
      >
        {{ $t('comments.username') }}
      </label>
      <input
        id="comment-username"
        v-model="form.username"
        type="text"
        :placeholder="$t('comments.username_placeholder')"
        class="bg-background border rounded-xl text-text-base text-[0.95rem] px-4 py-3 outline-none transition-all duration-200 placeholder:text-text-muted focus:border-primary focus:shadow-[0_0_0_3px_rgb(155_114_207_/0.15)]"
        :class="
          v$.username.$error
            ? 'border-error shadow-[0_0_0_3px_rgb(207_102_121_/0.15)]'
            : 'border-border'
        "
        @blur="v$.username.$touch()"
      />
      <span v-if="v$.username.$error" class="text-xs text-error">
        {{ v$.username.$errors[0]?.$message }}
      </span>
    </div>

    <!-- Message -->
    <div class="flex flex-col gap-1.5">
      <label
        class="text-[0.82rem] font-semibold text-text-muted uppercase tracking-[0.06em]"
        for="comment-message"
      >
        {{ $t('comments.message') }}
      </label>
      <ClientOnly>
        <div
          class="border rounded-xl overflow-hidden transition-all duration-200 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgb(155_114_207_/0.15)] editor-wrap"
          :class="
            v$.messageText.$error
              ? 'border-error shadow-[0_0_0_3px_rgb(207_102_121_/0.15)]'
              : 'border-border'
          "
        >
          <Editor
            id="comment-message"
            v-model="form.message"
            tinymce-script-src="/tinymce/tinymce.min.js"
            :init="editorInit"
            @blur="v$.messageText.$touch()"
          />
        </div>
        <template #fallback>
          <textarea
            v-model="form.message"
            class="w-full bg-background border border-border rounded-xl text-text-base text-[0.95rem] px-4 py-3 outline-none resize-y font-[inherit] transition-all duration-200 placeholder:text-text-muted focus:border-primary focus:shadow-[0_0_0_3px_rgb(155_114_207_/0.15)]"
            :placeholder="$t('comments.message_placeholder')"
            rows="4"
          />
        </template>
      </ClientOnly>
      <div class="flex justify-between items-center min-h-5">
        <span v-if="v$.messageText.$error" class="text-xs text-error">
          {{ v$.messageText.$errors[0]?.$message }}
        </span>
        <span
          class="text-xs ml-auto"
          :class="messageText.length > 450 ? 'text-warning' : 'text-text-muted'"
        >
          {{ messageText.length }}/500
        </span>
      </div>
    </div>

    <!-- Note -->
    <div class="flex flex-col gap-1.5">
      <label
        id="rating-label"
        class="text-[0.82rem] font-semibold text-text-muted uppercase tracking-[0.06em] flex items-center gap-2"
      >
        {{ $t('comments.rating') }}
        <span v-if="form.rating > 0" class="font-bold text-moon normal-case tracking-normal">
          {{ form.rating }}/10
        </span>
      </label>
      <div class="flex gap-1" role="group" aria-labelledby="rating-label">
        <button
          v-for="n in 10"
          :key="n"
          type="button"
          class="bg-transparent border-none text-2xl p-0 cursor-pointer transition-all duration-200 hover:scale-125 leading-none"
          :class="
            n <= form.rating
              ? 'text-moon drop-shadow-[0_0_4px_rgb(214_201_176_/0.4)]'
              : 'text-moon/20'
          "
          @click="
            form.rating = n
            v$.rating.$touch()
          "
        >
          ★
        </button>
      </div>
      <span v-if="v$.rating.$error" class="text-xs text-error">
        {{ v$.rating.$errors[0]?.$message }}
      </span>
    </div>

    <button
      type="submit"
      class="self-start px-7 py-2.5 bg-primary border-none rounded-xl text-white text-[0.9rem] font-semibold cursor-pointer transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed enabled:hover:bg-primary-dark"
      :disabled="isSubmitting"
    >
      {{ isSubmitting ? $t('comments.submitting') : $t('comments.submit') }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, maxLength, helpers, between } from '@vuelidate/validators'
import type { CommentFormData } from '~/types/comment'
import { isAlphaFr, isAlphaNumFr } from '~/utils/validators'

const Editor = defineAsyncComponent(() => import('@tinymce/tinymce-vue'))

const emit = defineEmits<{
  submitted: [data: CommentFormData]
}>()

const { t } = useI18n()

const form = reactive<CommentFormData>({
  username: '',
  message: '',
  rating: 0,
})

const isSubmitting = ref<boolean>(false)

const messageText = computed<string>(() =>
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
  auto_focus: false,
  branding: false,
  statusbar: false,
  resize: false,
}

const alphaFr = helpers.withMessage(() => t('validation.alpha_only'), isAlphaFr)
const alphaNumFr = helpers.withMessage(() => t('validation.alpha_num'), isAlphaNumFr)

const rules = {
  username: {
    required: helpers.withMessage(() => t('validation.required'), required),
    alphaFr,
    minLength: helpers.withMessage(() => t('validation.min_length', { min: 3 }), minLength(3)),
    maxLength: helpers.withMessage(() => t('validation.max_length', { max: 50 }), maxLength(50)),
  },
  messageText: {
    required: helpers.withMessage(
      () => t('validation.required'),
      (value: unknown) => typeof value === 'string' && value.trim().length > 0,
    ),
    alphaNumFr,
    minLength: helpers.withMessage(() => t('validation.min_length', { min: 3 }), minLength(3)),
    maxLength: helpers.withMessage(() => t('validation.max_length', { max: 500 }), maxLength(500)),
  },
  rating: {
    required: helpers.withMessage(
      () => t('validation.rating_required'),
      (value: unknown) => typeof value === 'number' && value > 0,
    ),
    between: helpers.withMessage(() => t('validation.rating_required'), between(1, 10)),
  },
}

const v$ = useVuelidate(rules, {
  username: toRef(form, 'username'),
  messageText,
  rating: toRef(form, 'rating'),
})

async function submit(): Promise<void> {
  const valid = await v$.value.$validate()
  if (!valid) return

  isSubmitting.value = true
  emit('submitted', { username: form.username, message: form.message, rating: form.rating })
  form.username = ''
  form.message = ''
  form.rating = 0
  v$.value.$reset()
  isSubmitting.value = false
}
</script>

<style scoped>
.editor-wrap :deep(.tox-tinymce) {
  border: none;
  border-radius: 0;
}
.editor-wrap :deep(.tox:not(.tox-tinymce-inline) .tox-editor-header) {
  background: #221b36;
  border-bottom: 1px solid #2a2244;
  box-shadow: none;
}
.editor-wrap :deep(.tox .tox-toolbar__primary) {
  background: #221b36;
}
.editor-wrap :deep(.tox .tox-tbtn) {
  color: #8f82a6;
}
.editor-wrap :deep(.tox .tox-tbtn:hover) {
  background: rgb(160 122 212 / 0.1);
  color: #efe9e0;
}
.editor-wrap :deep(.tox .tox-tbtn--enabled) {
  background: rgb(160 122 212 / 0.15);
  color: #a07ad4;
}
</style>
