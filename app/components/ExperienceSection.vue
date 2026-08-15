<script setup lang="ts">
import { experiences } from '~/data/experience'
</script>

<template>
  <section id="experience" aria-labelledby="experience-heading" class="scroll-mt-16">
    <UContainer class="py-20 sm:py-28">
      <div class="max-w-3xl">
        <h2
          id="experience-heading"
          class="text-xs font-semibold uppercase tracking-[0.2em] text-(--ui-text-muted)"
        >
          Experience
        </h2>

        <ol class="mt-10 space-y-10">
          <li v-for="experience in experiences" :key="experience.company">
            <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 class="text-lg font-semibold text-(--ui-text-highlighted)">
                {{ experience.company }}
              </h3>
              <p v-if="experience.context" class="text-sm text-(--ui-text-muted)">
                {{ experience.context }}
              </p>
            </div>

            <ol
              class="mt-4 border-l border-(--ui-border) pl-5 sm:pl-6"
            >
              <li
                v-for="role in experience.roles"
                :key="role.title"
                class="relative pb-6 last:pb-0"
              >
                <span
                  aria-hidden="true"
                  class="absolute -left-px top-1.5 size-2 -translate-x-1/2 rounded-full bg-primary/70"
                />
                <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                  <p class="font-medium text-(--ui-text-toned)">{{ role.title }}</p>
                  <time
                    class="text-xs text-(--ui-text-muted)"
                    :datetime="`${role.start}–${role.end}`"
                  >
                    {{ role.start }} – {{ role.end }}
                  </time>
                </div>
                <p v-if="role.context" class="mt-1 text-sm text-(--ui-text-muted)">
                  {{ role.context }}
                </p>
              </li>
            </ol>
          </li>
        </ol>
      </div>
    </UContainer>
  </section>
</template>
