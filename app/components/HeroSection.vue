<template>
  <section class="relative isolate overflow-hidden">
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
      <div class="hero-grid absolute inset-0" />
      <div
        class="hero-glow absolute -top-48 left-1/2 h-96 w-128 -translate-x-1/2 rounded-full"
      />
      <div
        class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-default"
      />
    </div>

    <UContainer class="relative py-24 sm:py-32 lg:py-44">
      <div class="max-w-3xl">
        <p
          class="hero-enter mb-6 inline-flex items-center gap-2 rounded-full border border-default bg-elevated/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted"
          style="--hero-delay: 0ms"
        >
          <span class="relative flex size-2">
            <span
              class="absolute inline-flex size-full animate-ping rounded-full bg-primary/60 motion-reduce:animate-none"
            />
            <span class="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          Istanbul, Turkey
        </p>

        <h1
          class="hero-enter text-5xl font-semibold tracking-tight text-highlighted sm:text-6xl lg:text-7xl"
          style="--hero-delay: 80ms"
        >
          Amir Nouri
        </h1>

        <div
          class="hero-enter mt-6 flex items-center gap-4 sm:gap-5"
          style="--hero-delay: 160ms"
        >
          <span aria-hidden="true" class="h-px w-10 bg-primary sm:w-14" />
          <p class="text-lg font-medium text-primary sm:text-xl lg:text-2xl">
            Senior Software Engineer
          </p>
        </div>

        <p
          class="hero-enter mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          style="--hero-delay: 240ms"
        >
          Building and scaling web products for 50M+ users — React, Next.js, and
          TypeScript at Snapp.
        </p>

        <div
          class="hero-enter mt-10 flex flex-wrap items-center gap-4"
          style="--hero-delay: 320ms"
        >
          <UButton
            to="/Amir_Nouri_Resume.pdf"
            external
            download
            size="lg"
            class="font-medium"
          >
            <template #leading>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-5"
                aria-hidden="true"
              >
                <path d="M12 3v12" />
                <path d="m7 10 5 5 5-5" />
                <path d="M4 21h16" />
              </svg>
            </template>
            Download Resume
          </UButton>
        </div>
      </div>
    </UContainer>
  </section>
</template>

<style scoped>
.hero-grid {
  background-image: radial-gradient(
    circle,
    color-mix(in oklab, var(--ui-border-accented) 55%, transparent) 1px,
    transparent 1px
  );
  background-size: 24px 24px;
  -webkit-mask-image: radial-gradient(
    ellipse 80% 60% at 50% 0%,
    black 40%,
    transparent 75%
  );
  mask-image: radial-gradient(
    ellipse 80% 60% at 50% 0%,
    black 40%,
    transparent 75%
  );
  opacity: 0.5;
}

.hero-glow {
  background: radial-gradient(
    circle,
    color-mix(in oklab, var(--ui-primary) 18%, transparent) 0%,
    transparent 70%
  );
  filter: blur(24px);
}

.hero-enter {
  animation: hero-rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: var(--hero-delay, 0ms);
}

@media (prefers-reduced-motion: reduce) {
  .hero-enter {
    animation: none;
  }
}

@keyframes hero-rise {
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
