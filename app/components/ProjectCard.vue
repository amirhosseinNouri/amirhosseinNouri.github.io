<template>
  <article
    class="group flex h-full flex-col overflow-hidden rounded-2xl border border-(--ui-border) bg-elevated transition-[border-color,transform] duration-300 hover:border-(--ui-border-accented) hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
  >
    <NuxtLink
      :to="`/projects/${project.slug}`"
      :aria-label="project.name"
      class="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div class="project-card-media relative aspect-[16/10] overflow-hidden">
        <div aria-hidden="true" class="project-card-fallback absolute inset-0" />
        <span
          aria-hidden="true"
          class="absolute inset-0 flex items-center justify-center text-4xl font-semibold text-primary/40"
        >
          {{ project.name.slice(0, 1) }}
        </span>
        <img
          v-show="!imageFailed"
          :src="project.image"
          :alt="project.imageAlt"
          width="1280"
          height="800"
          :loading="priority ? 'eager' : 'lazy'"
          :fetchpriority="priority ? 'high' : 'auto'"
          class="relative h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          @error="imageFailed = true"
        />
      </div>
    </NuxtLink>

    <div class="flex flex-1 flex-col gap-3 p-5 sm:p-6">
      <NuxtLink
        :to="`/projects/${project.slug}`"
        class="inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <h3
          :id="`project-${project.slug}`"
          class="text-lg font-semibold tracking-tight text-(--ui-text-highlighted) transition-colors duration-200 group-hover:text-(--ui-primary) motion-reduce:transition-none"
        >
          {{ project.name }}
        </h3>
      </NuxtLink>

      <p class="text-sm leading-relaxed text-(--ui-text-toned)">
        {{ project.description }}
      </p>

      <ul class="flex flex-wrap gap-1.5" aria-label="Technologies">
        <li v-for="tag in project.tags" :key="tag">
          <UBadge :label="tag" color="neutral" variant="subtle" size="sm" />
        </li>
      </ul>

      <div class="mt-auto flex flex-wrap gap-2 pt-2">
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
          size="sm"
        >
          {{ link.label }}
        </UButton>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Project } from '~/types/project'
import { isExternal, linkIcons, linkVariants } from '~/composables/useProjectLinks'

const props = defineProps<{ project: Project; priority?: boolean }>()

const imageFailed = ref(false)

watch(
  () => props.project.image,
  () => {
    imageFailed.value = false
  }
)
</script>

<style scoped>
.project-card-media {
  background: linear-gradient(
    135deg,
    color-mix(in oklab, var(--ui-primary) 14%, transparent),
    color-mix(in oklab, var(--ui-bg-accented) 45%, transparent)
  );
}

.project-card-fallback {
  background-image: radial-gradient(
    circle,
    color-mix(in oklab, var(--ui-border-accented) 55%, transparent) 1px,
    transparent 1px
  );
  background-size: 16px 16px;
  opacity: 0.6;
}
</style>
