<template>
  <header class="sticky top-0 z-[100] bg-background/85 backdrop-blur-md border-b border-border">
    <div class="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 no-underline text-text-base hover:opacity-80 transition-opacity duration-200"
      >
        <span
          class="text-[1.75rem] text-moon leading-none"
          style="filter: drop-shadow(0 0 6px rgb(155 114 207 / 0.6))"
          >✦</span
        >
        <span
          class="text-xl font-bold tracking-[0.06em]"
          style="
            background: linear-gradient(135deg, #d6c9b0 0%, #9b72cf 60%, #c8a951 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
          "
          >Cinescope</span
        >
      </NuxtLink>

      <span
        class="absolute left-1/2 -translate-x-1/2 text-lg opacity-5 cursor-default transition-opacity duration-[400ms] hover:opacity-100"
        title="meow"
        >🐈‍⬛</span
      >

      <div class="flex gap-1">
        <button
          v-for="loc in locales"
          :key="loc.code"
          class="bg-transparent border rounded-md text-xs font-semibold tracking-[0.05em] px-2.5 py-1 cursor-pointer transition-colors duration-200"
          :class="
            loc.code === locale
              ? 'text-moon border-moon shadow-[0_0_8px_rgb(155_114_207_/0.3)]'
              : 'text-text-muted border-border hover:text-text-base hover:border-text-muted'
          "
          @click="setLocale(loc.code)"
        >
          {{ loc.code.toUpperCase() }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
</script>
