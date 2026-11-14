<script setup lang="ts">
import { parseMarkdown } from '@nuxtjs/mdc/runtime'
import type { PublicNote } from '#shared/types/note'

const route = useRoute()
const siteConfig = useSiteConfig()
const slug = computed(() => String(route.params.slug ?? ''))

const { data: note, error } = await useFetch<PublicNote>(
  () => `/api/notes/${encodeURIComponent(slug.value)}`
)

if (error.value || !note.value) {
  throw createError({
    statusCode: error.value?.statusCode ?? 404,
    statusMessage: 'Note not found',
    fatal: true
  })
}

const { data: parsed } = await useAsyncData(
  () => `note-md-${slug.value}-${note.value?.updatedAt}`,
  () =>
    parseMarkdown(note.value?.content ?? '', {
      toc: { depth: 3, searchDepth: 3 }
    })
)

const tocLinks = computed(() => parsed.value?.toc?.links ?? [])
const canonical = computed(() => `${siteConfig.url}/notes/${slug.value}`)

useSeoMeta({
  title: () => note.value?.title ?? 'Note',
  description: () => note.value?.description ?? undefined,
  ogTitle: () => note.value?.title,
  ogDescription: () => note.value?.description ?? undefined,
  ogType: 'article',
  ogUrl: () => canonical.value,
  articlePublishedTime: () => note.value?.publishedAt ?? undefined,
  articleModifiedTime: () => note.value?.updatedAt
})

useHead(() => ({ link: [{ rel: 'canonical', href: canonical.value }] }))
</script>

<template>
  <main v-if="note">
    <AppContainer class="max-w-3xl py-16 sm:py-24">
      <UButton
        to="/notes"
        color="neutral"
        variant="ghost"
        size="sm"
        icon="i-lucide-arrow-left"
      >
        All notes
      </UButton>

      <header class="mt-8">
        <h1
          class="text-3xl font-semibold tracking-tight text-(--ui-text-highlighted) sm:text-4xl"
        >
          {{ note.title }}
        </h1>
        <p v-if="note.description" class="mt-4 text-lg text-(--ui-text-toned)">
          {{ note.description }}
        </p>
        <div
          class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-(--ui-text-muted)"
        >
          <time :datetime="note.publishedAt ?? undefined">
            {{ formatNoteDate(note.publishedAt) }}
          </time>
          <ul
            v-if="note.tags.length"
            class="flex flex-wrap gap-1.5"
            aria-label="Tags"
          >
            <li v-for="tag in note.tags" :key="tag">
              <NuxtLink
                :to="`/notes?tag=${encodeURIComponent(tag)}`"
                class="rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <UBadge
                  :label="tag"
                  color="neutral"
                  variant="subtle"
                  size="sm"
                  class="hover:bg-(--ui-bg-accented)"
                />
              </NuxtLink>
            </li>
          </ul>
        </div>
      </header>

      <nav
        v-if="tocLinks.length > 1"
        aria-label="Contents"
        class="mt-10 rounded-xl border border-(--ui-border) bg-(--ui-bg-elevated)/40 p-5"
      >
        <p
          class="text-xs font-semibold uppercase tracking-[0.2em] text-(--ui-text-muted)"
        >
          Contents
        </p>
        <ul class="mt-3 space-y-1.5 text-sm">
          <li v-for="link in tocLinks" :key="link.id">
            <a
              :href="`#${link.id}`"
              class="text-(--ui-text-toned) hover:text-(--ui-primary)"
            >
              {{ link.text }}
            </a>
            <ul v-if="link.children?.length" class="mt-1.5 space-y-1.5 pl-4">
              <li v-for="child in link.children" :key="child.id">
                <a
                  :href="`#${child.id}`"
                  class="text-(--ui-text-muted) hover:text-(--ui-primary)"
                >
                  {{ child.text }}
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <article class="note-body mt-10" data-testid="note-body">
        <MDCRenderer v-if="parsed" :body="parsed.body" :data="parsed.data" />
      </article>
    </AppContainer>
  </main>
</template>
