<script setup lang="ts">
import { projects as defaultProjects } from '~/data/projects'
import type { Project } from '~/types/project'

withDefaults(defineProps<{ projects?: Project[] }>(), {
  projects: () => defaultProjects
})
</script>

<template>
  <section id="projects" aria-labelledby="projects-heading" class="scroll-mt-16">
    <UContainer class="py-20 sm:py-28">
      <h2
        id="projects-heading"
        class="text-xs font-semibold uppercase tracking-[0.2em] text-(--ui-text-muted)"
      >
        Projects
      </h2>

      <div class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        <ProjectCard
          v-for="(project, index) in projects"
          :key="project.slug"
          :project="project"
          :priority="index === 0"
        />
      </div>
    </UContainer>
  </section>
</template>
