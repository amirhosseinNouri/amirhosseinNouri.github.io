<script setup lang="ts">
import type { NoteSummary } from '#shared/types/note'

useSeoMeta({
  title: 'Notes',
  description:
    'Short notes and things I have learned here and there — less polished than a blog post.'
})

const route = useRoute()
const router = useRouter()

const { data: notes } = await useFetch<NoteSummary[]>('/api/notes', {
  default: () => []
})

const activeTag = computed(() =>
  typeof route.query.tag === 'string' ? route.query.tag : null
)

const tagCounts = computed(() => {
  const counts = new Map<string, number>()
  for (const note of notes.value) {
    for (const tag of note.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
  )
})

const visibleNotes = computed(() =>
  activeTag.value
    ? notes.value.filter((n) => n.tags.includes(activeTag.value!))
    : notes.value
)

function selectTag(tag: string | null) {
  router.replace({ query: tag ? { tag } : {} })
}
</script>

<template>
  <main>
    <AppContainer class="max-w-3xl py-16 sm:py-24">
      <header>
        <h1
          class="text-4xl font-semibold tracking-tight text-(--ui-text-highlighted) sm:text-5xl"
        >
          Notes
        </h1>
        <p
          class="mt-4 text-base leading-relaxed text-(--ui-text-toned) sm:text-lg"
        >
          A collection of short notes and things I've learned here and there.
          They're less polished than a blog post — mostly written so future me
          can find them again.
        </p>
      </header>

      <div
        v-if="tagCounts.length"
        class="mt-10 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter notes by topic"
      >
        <UButton
          size="sm"
          :color="activeTag ? 'neutral' : 'primary'"
          :variant="activeTag ? 'outline' : 'solid'"
          :aria-pressed="!activeTag"
          @click="selectTag(null)"
        >
          All ({{ notes.length }})
        </UButton>
        <UButton
          v-for="[tag, count] in tagCounts"
          :key="tag"
          size="sm"
          :color="activeTag === tag ? 'primary' : 'neutral'"
          :variant="activeTag === tag ? 'solid' : 'outline'"
          :aria-pressed="activeTag === tag"
          :data-tag="tag"
          @click="selectTag(tag)"
        >
          {{ tag }} ({{ count }})
        </UButton>
      </div>

      <ul
        v-if="visibleNotes.length"
        class="mt-8 divide-y divide-(--ui-border) border-y border-(--ui-border)"
        data-testid="notes-list"
      >
        <li v-for="note in visibleNotes" :key="note.slug">
          <NuxtLink
            :to="`/notes/${note.slug}`"
            class="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <time
              :datetime="note.publishedAt ?? undefined"
              class="shrink-0 text-sm tabular-nums text-(--ui-text-muted) sm:w-28"
            >
              {{ formatNoteDate(note.publishedAt) }}
            </time>
            <span
              class="font-medium text-(--ui-text-highlighted) underline-offset-4 group-hover:text-(--ui-primary) group-hover:underline"
            >
              {{ note.title }}
            </span>
          </NuxtLink>
        </li>
      </ul>

      <UEmpty
        v-else
        class="mt-10"
        icon="i-lucide-notebook-pen"
        title="No notes yet"
        :description="
          activeTag
            ? `Nothing tagged “${activeTag}” yet.`
            : 'The first notes are on the way.'
        "
        variant="soft"
      />
    </AppContainer>
  </main>
</template>
