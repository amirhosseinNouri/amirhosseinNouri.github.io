<script setup lang="ts">
const copy =
  'Five years building and scaling web products used by more than 50 million people — from passenger-facing PWAs to modular microfrontend back-office systems. My focus has been the frontend platform: leading SSR migrations, building design systems, and improving developer workflows across React, Next.js, and TypeScript. I work alongside engineers, designers, and product teams to make performance, release reliability, and the day-to-day of shipping measurably better.'
</script>

<template>
  <section id="about" aria-labelledby="about-heading" class="scroll-mt-16">
    <UContainer class="py-20 sm:py-28">
      <div class="max-w-2xl">
        <h2
          id="about-heading"
          class="text-xs font-semibold uppercase tracking-[0.2em] text-(--ui-text-muted)"
        >
          About
        </h2>
        <p
          class="mt-6 text-lg leading-relaxed text-(--ui-text-toned) sm:text-xl sm:leading-relaxed"
        >
          {{ copy }}
        </p>
      </div>
    </UContainer>
  </section>
</template>
