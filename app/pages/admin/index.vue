<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { AdminNote } from '#shared/types/note'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useSeoMeta({ title: 'Notes admin', robots: 'noindex, nofollow' })

const toast = useToast()
const {
  data: notes,
  status,
  refresh
} = await useFetch<AdminNote[]>('/api/admin/notes', {
  server: false,
  default: () => []
})

const search = ref('')
const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return notes.value
  return notes.value.filter(
    (n) =>
      n.title.toLowerCase().includes(q) || n.tags.some((t) => t.includes(q))
  )
})

const columns: TableColumn<AdminNote>[] = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'tags', header: 'Tags' },
  { accessorKey: 'updatedAt', header: 'Updated' },
  { id: 'actions', header: '' }
]

const pendingDelete = ref<AdminNote | null>(null)
const deleting = ref(false)

async function confirmDelete() {
  if (!pendingDelete.value) return
  deleting.value = true
  try {
    await $fetch(`/api/admin/notes/${pendingDelete.value.id}`, {
      method: 'DELETE'
    })
    toast.add({
      title: 'Note deleted',
      description: pendingDelete.value.title,
      color: 'success'
    })
    pendingDelete.value = null
    await refresh()
  } catch (e) {
    toast.add({
      title: 'Delete failed',
      description: (e as Error).message,
      color: 'error'
    })
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-(--ui-text-highlighted)">
          Notes
        </h1>
        <p class="text-sm text-(--ui-text-muted)">{{ notes.length }} total</p>
      </div>
      <div class="flex items-center gap-2">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Search title or tag"
        />
        <UButton to="/admin/notes/new" icon="i-lucide-plus">New note</UButton>
      </div>
    </div>

    <UTable
      class="mt-6 rounded-lg border border-(--ui-border)"
      :data="filtered"
      :columns="columns"
      :loading="status === 'pending'"
      empty="No notes yet — create your first one."
    >
      <template #title-cell="{ row }">
        <NuxtLink
          :to="`/admin/notes/${row.original.id}`"
          class="font-medium text-(--ui-text-highlighted) hover:text-(--ui-primary)"
        >
          {{ row.original.title }}
        </NuxtLink>
        <p class="text-xs text-(--ui-text-muted)">
          /notes/{{ row.original.slug }}
        </p>
      </template>
      <template #status-cell="{ row }">
        <UBadge
          :label="row.original.status"
          :color="row.original.status === 'published' ? 'success' : 'neutral'"
          variant="subtle"
          class="capitalize"
        />
      </template>
      <template #tags-cell="{ row }">
        <div class="flex flex-wrap gap-1">
          <UBadge
            v-for="tag in row.original.tags"
            :key="tag"
            :label="tag"
            color="neutral"
            variant="outline"
            size="sm"
          />
        </div>
      </template>
      <template #updatedAt-cell="{ row }">
        <span class="text-sm text-(--ui-text-muted)">{{
          formatNoteDate(row.original.updatedAt)
        }}</span>
      </template>
      <template #actions-cell="{ row }">
        <div class="flex justify-end gap-1">
          <UButton
            v-if="row.original.status === 'published'"
            :to="`/notes/${row.original.slug}`"
            target="_blank"
            icon="i-lucide-eye"
            color="neutral"
            variant="ghost"
            size="sm"
            aria-label="View"
          />
          <UButton
            :to="`/admin/notes/${row.original.id}`"
            icon="i-lucide-pencil"
            color="neutral"
            variant="ghost"
            size="sm"
            aria-label="Edit"
          />
          <UButton
            icon="i-lucide-trash-2"
            color="error"
            variant="ghost"
            size="sm"
            aria-label="Delete"
            @click="pendingDelete = row.original"
          />
        </div>
      </template>
    </UTable>

    <UModal
      :open="!!pendingDelete"
      title="Delete note?"
      :description="
        pendingDelete
          ? `“${pendingDelete.title}” will be permanently deleted.`
          : ''
      "
      @update:open="
        (open) => {
          if (!open) pendingDelete = null
        }
      "
    >
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton
            color="neutral"
            variant="outline"
            @click="pendingDelete = null"
            >Cancel</UButton
          >
          <UButton color="error" :loading="deleting" @click="confirmDelete"
            >Delete</UButton
          >
        </div>
      </template>
    </UModal>
  </div>
</template>
