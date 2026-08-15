<script setup lang="ts">
import { skillGroups } from '~/data/skills'
</script>

<template>
  <section id="skills" aria-labelledby="skills-heading" class="scroll-mt-16">
    <UContainer class="py-20 sm:py-28">
      <h2
        id="skills-heading"
        class="text-xs font-semibold uppercase tracking-[0.2em] text-(--ui-text-muted)"
      >
        Skills
      </h2>

      <div
        class="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div v-for="group in skillGroups" :key="group.category">
          <h3 class="text-sm font-semibold text-(--ui-text-toned)">
            {{ group.category }}
          </h3>

          <ul class="mt-3 flex flex-wrap gap-2" :aria-label="group.category">
            <li v-for="skill in group.skills" :key="skill">
              <UBadge
                :label="skill"
                color="neutral"
                variant="subtle"
                size="sm"
              />
            </li>
          </ul>
        </div>
      </div>
    </UContainer>
  </section>
</template>
