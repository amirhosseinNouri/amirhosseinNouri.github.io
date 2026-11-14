<script setup lang="ts">
import type { AdminNote } from '#shared/types/note'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const {
  data: note,
  error,
  status
} = await useFetch<AdminNote>(() => `/api/admin/notes/${route.params.id}`, {
  server: false
})

useSeoMeta({
  title: () => (note.value ? `Edit: ${note.value.title}` : 'Edit note'),
  robots: 'noindex, nofollow'
})
</script>

<template>
  <AdminNoteForm v-if="note" :key="note.id" :note="note" />
  <UEmpty
    v-else-if="error"
    icon="i-lucide-file-x"
    title="Note not found"
    :description="error.statusMessage"
    :actions="[{ label: 'Back to notes', to: '/admin' }]"
  />
  <div v-else-if="status === 'pending'" class="flex justify-center py-24">
    <UIcon
      name="i-lucide-loader-circle"
      class="size-6 animate-spin text-(--ui-text-muted)"
    />
  </div>
</template>
