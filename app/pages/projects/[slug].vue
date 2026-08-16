<script setup lang="ts">
import { projects } from '~/data/projects'
import { isExternal, linkIcons, linkVariants } from '~/composables/useProjectLinks'

const route = useRoute()
const siteConfig = useSiteConfig()

const slug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : ''
)

const project = computed(() => projects.find((p) => p.slug === slug.value))

useSeoMeta({
  title: () => project.value?.name ?? 'Project not found',
  description: () =>
    project.value?.description ?? 'This project could not be found on the site.',
  ogTitle: () => project.value?.name,
  ogDescription: () => project.value?.description,
  ogType: 'article',
  ogUrl: () =>
    project.value
      ? `${siteConfig.url}/projects/${project.value.slug}`
      : undefined,
  ogImage: `${siteConfig.url}/og.png`
})

useHead(() => ({
  link: project.value
    ? [
        {
          rel: 'canonical',
          href: `${siteConfig.url}/projects/${project.value.slug}`
        }
      ]
    : []
}))
</script>

<template>
  <main>
    <template v-if="project">
      <section class="relative isolate overflow-hidden">
        <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
          <div class="detail-grid absolute inset-0" />
          <div
            class="detail-glow absolute -top-48 left-1/2 h-96 w-128 -translate-x-1/2 rounded-full"
          />
          <div
            class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-default"
          />
        </div>

        <UContainer class="py-16 sm:py-24">
          <div class="detail-enter" style="--detail-delay: 0ms">
            <UButton
              to="/#projects"
              color="neutral"
              variant="ghost"
              size="sm"
              class="font-medium"
            >
              <template #leading>
                <Icon
                  name="i-lucide-arrow-left"
                  class="size-4"
                  aria-hidden="true"
                />
              </template>
              Back to all projects
            </UButton>
          </div>

          <header class="mt-10 max-w-2xl">
            <p
              class="detail-enter text-xs font-semibold uppercase tracking-[0.2em] text-(--ui-text-muted)"
              style="--detail-delay: 60ms"
            >
              Project
            </p>

            <h1
              class="detail-enter mt-3 text-4xl font-semibold tracking-tight text-(--ui-text-highlighted) sm:text-5xl lg:text-6xl"
              style="--detail-delay: 120ms"
            >
              {{ project.name }}
            </h1>

            <p
              class="detail-enter mt-5 text-base leading-relaxed text-(--ui-text-toned) sm:text-lg"
              style="--detail-delay: 180ms"
            >
              {{ project.description }}
            </p>

            <ul
              class="detail-enter mt-6 flex flex-wrap gap-1.5"
              aria-label="Technologies"
              style="--detail-delay: 240ms"
            >
              <li v-for="tag in project.tags" :key="tag">
                <UBadge :label="tag" color="neutral" variant="subtle" size="sm" />
              </li>
            </ul>

            <div
              class="detail-enter mt-8 flex flex-wrap gap-2"
              style="--detail-delay: 300ms"
            >
              <UButton
                v-for="link in project.links"
                :key="link.href"
                :to="link.href"
                :external="isExternal(link.href)"
                :target="isExternal(link.href) ? '_blank' : undefined"
                :rel="isExternal(link.href) ? 'noopener noreferrer' : undefined"
                :icon="linkIcons[link.type]"
                :color="link.type === 'demo' ? 'primary' : 'neutral'"
                :variant="linkVariants[link.type]"
                size="md"
              >
                {{ link.label }}
              </UButton>
            </div>
          </header>
        </UContainer>
      </section>

      <UContainer class="pb-20 sm:pb-28">
        <div
          class="detail-image relative aspect-[16/10] overflow-hidden rounded-2xl border border-(--ui-border)"
        >
          <div aria-hidden="true" class="detail-image-fallback absolute inset-0" />
          <img
            :src="project.image"
            :alt="project.imageAlt"
            width="1280"
            height="800"
            loading="eager"
            fetchpriority="high"
            class="relative h-full w-full object-cover object-top"
          />
        </div>
      </UContainer>
    </template>

    <template v-else>
      <div class="flex min-h-[70vh] items-center justify-center px-4 py-24 sm:py-32">
        <h1 class="sr-only">Project not found</h1>
        <UContainer class="flex justify-center">
          <UEmpty
            title="Project not found"
            description="That project doesn't exist — it may have been removed or the address may have been mistyped."
            :actions="[
              {
                label: 'Back to home',
                to: '/',
                color: 'primary',
                variant: 'solid',
                size: 'lg'
              },
              {
                label: 'Browse projects',
                to: '/#projects',
                color: 'neutral',
                variant: 'outline',
                size: 'lg'
              }
            ]"
            variant="soft"
            size="lg"
          >
            <template #leading>
              <span
                class="flex size-14 items-center justify-center rounded-full bg-(--ui-primary)/10 text-(--ui-primary) sm:size-16"
              >
                <Icon
                  name="i-lucide-search-x"
                  class="size-6 sm:size-7"
                  aria-hidden="true"
                />
              </span>
            </template>
          </UEmpty>
        </UContainer>
      </div>
    </template>
  </main>
</template>

<style scoped>
.detail-grid {
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

.detail-glow {
  background: radial-gradient(
    circle,
    color-mix(in oklab, var(--ui-primary) 18%, transparent) 0%,
    transparent 70%
  );
  filter: blur(24px);
}

.detail-image {
  background: linear-gradient(
    135deg,
    color-mix(in oklab, var(--ui-primary) 14%, transparent),
    color-mix(in oklab, var(--ui-bg-accented) 45%, transparent)
  );
}

.detail-image-fallback {
  background-image: radial-gradient(
    circle,
    color-mix(in oklab, var(--ui-border-accented) 55%, transparent) 1px,
    transparent 1px
  );
  background-size: 16px 16px;
  opacity: 0.6;
}

.detail-enter {
  animation: detail-rise 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: var(--detail-delay, 0ms);
}

@media (prefers-reduced-motion: reduce) {
  .detail-enter {
    animation: none;
  }
}

@keyframes detail-rise {
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
