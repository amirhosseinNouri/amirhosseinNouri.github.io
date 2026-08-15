<template>
  <footer class="w-full border-t border-(--ui-border)">
    <div
      class="mx-auto flex w-full max-w-(--ui-container) flex-col items-center gap-6 px-4 py-8 sm:px-6 md:flex-row md:justify-between md:py-10"
    >
      <div class="flex flex-col items-center gap-1 text-center md:items-start md:text-left">
        <p class="text-xs text-(--ui-text-muted)">
          © {{ currentYear }} Amir Nouri
        </p>
        <p class="text-xs text-(--ui-text-muted)">
          This site uses anonymous analytics. No personal data is collected.
        </p>
      </div>

      <ul class="flex items-center gap-1" aria-label="Social links">
        <li v-for="social in socials" :key="social.label">
          <UButton
            :icon="social.icon"
            :aria-label="social.label"
            :to="social.href"
            :target="isMailto(social.href) ? undefined : '_blank'"
            :rel="isMailto(social.href) ? undefined : 'noopener noreferrer'"
            color="neutral"
            variant="ghost"
            square
            class="rounded-full"
          />
        </li>
      </ul>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { socials } from '~/data/socials'

const currentYear = new Date().getFullYear()

function isMailto(href: string) {
  return href.startsWith('mailto:')
}
</script>
