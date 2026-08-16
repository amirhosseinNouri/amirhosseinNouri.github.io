<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error.statusCode === 404)

useHead({
  title: is404.value
    ? '404 — Page not found'
    : `Error ${props.error.statusCode}`,
  htmlAttrs: {
    lang: 'en'
  }
})
</script>

<template>
  <main
    class="relative isolate flex min-h-svh items-center justify-center overflow-hidden px-4 py-16"
  >
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
      <div class="error-grid absolute inset-0" />
      <div
        class="error-glow absolute -top-40 left-1/2 h-96 w-128 -translate-x-1/2 rounded-full"
      />
      <div
        class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-default"
      />
    </div>

    <UContainer>
      <div
        class="error-enter mx-auto max-w-lg rounded-3xl border border-(--ui-border) bg-elevated/70 px-6 py-12 text-center shadow-sm backdrop-blur-sm sm:px-12 sm:py-16"
      >
        <div
          aria-hidden="true"
          class="mx-auto flex size-14 items-center justify-center rounded-2xl border border-(--ui-border-accented) bg-(--ui-bg-accented) font-display text-lg font-semibold text-primary"
        >
          AN
        </div>

        <p
          class="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-(--ui-text-muted)"
        >
          <span v-if="is404">Error 404</span>
          <span v-else>Error {{ error.statusCode }}</span>
        </p>

        <h1
          class="mt-3 text-4xl font-semibold tracking-tight text-(--ui-text-highlighted) sm:text-5xl"
        >
          <span v-if="is404">Page not found</span>
          <span v-else>Something went wrong</span>
        </h1>

        <p class="mt-4 text-base leading-relaxed text-(--ui-text-toned)">
          <span v-if="is404">
            That address doesn't lead anywhere on this site — it may have been
            mistyped or the page may have moved.
          </span>
          <span v-else>
            An unexpected error occurred while loading this page. Please try
            again.
          </span>
        </p>

        <div class="mt-8 flex justify-center">
          <UButton to="/" size="lg" class="font-medium">
            <template #leading>
              <Icon
                name="i-lucide-arrow-left"
                class="size-5"
                aria-hidden="true"
              />
            </template>
            Back home
          </UButton>
        </div>
      </div>
    </UContainer>
  </main>
</template>

<style scoped>
.error-grid {
  background-image: radial-gradient(
    circle,
    color-mix(in oklab, var(--ui-border-accented) 55%, transparent) 1px,
    transparent 1px
  );
  background-size: 24px 24px;
  -webkit-mask-image: radial-gradient(
    ellipse 70% 50% at 50% 0%,
    black 40%,
    transparent 75%
  );
  mask-image: radial-gradient(
    ellipse 70% 50% at 50% 0%,
    black 40%,
    transparent 75%
  );
  opacity: 0.5;
}

.error-glow {
  background: radial-gradient(
    circle,
    color-mix(in oklab, var(--ui-primary) 18%, transparent) 0%,
    transparent 70%
  );
  filter: blur(24px);
}

.error-enter {
  animation: error-rise 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  .error-enter {
    animation: none;
  }
}

@keyframes error-rise {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
