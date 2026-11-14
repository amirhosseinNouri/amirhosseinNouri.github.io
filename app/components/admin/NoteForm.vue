<script setup lang="ts">
import type { EditorToolbarItem } from '@nuxt/ui'
import type { AdminNote, NoteStatus } from '#shared/types/note'
import { slugify } from '#shared/utils/slug'

const props = defineProps<{ note?: AdminNote }>()

const toast = useToast()

interface FormState {
  title: string
  slug: string
  description: string
  tags: string[]
  status: NoteStatus
  content: string
}

function fromNote(note?: AdminNote): FormState {
  return {
    title: note?.title ?? '',
    slug: note?.slug ?? '',
    description: note?.description ?? '',
    tags: [...(note?.tags ?? [])],
    status: note?.status ?? 'draft',
    content: note?.content ?? ''
  }
}

const state = reactive<FormState>(fromNote(props.note))
const saved = ref(JSON.stringify(state))
const dirty = computed(() => JSON.stringify(state) !== saved.value)
const saving = ref(false)

// Auto-derive the slug from the title until the user edits it by hand.
const slugTouched = ref(!!props.note)
watch(
  () => state.title,
  (title) => {
    if (!slugTouched.value) state.slug = slugify(title)
  }
)

const statusItems = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' }
]

const toolbarItems: EditorToolbarItem[][] = [
  [
    { kind: 'undo', icon: 'i-lucide-undo', tooltip: { text: 'Undo' } },
    { kind: 'redo', icon: 'i-lucide-redo', tooltip: { text: 'Redo' } }
  ],
  [
    {
      icon: 'i-lucide-heading',
      tooltip: { text: 'Headings' },
      content: { align: 'start' },
      items: [
        {
          kind: 'heading',
          level: 2,
          icon: 'i-lucide-heading-2',
          label: 'Heading 2'
        },
        {
          kind: 'heading',
          level: 3,
          icon: 'i-lucide-heading-3',
          label: 'Heading 3'
        },
        {
          kind: 'heading',
          level: 4,
          icon: 'i-lucide-heading-4',
          label: 'Heading 4'
        }
      ]
    },
    {
      kind: 'paragraph',
      icon: 'i-lucide-pilcrow',
      tooltip: { text: 'Paragraph' }
    }
  ],
  [
    {
      kind: 'mark',
      mark: 'bold',
      icon: 'i-lucide-bold',
      tooltip: { text: 'Bold' }
    },
    {
      kind: 'mark',
      mark: 'italic',
      icon: 'i-lucide-italic',
      tooltip: { text: 'Italic' }
    },
    {
      kind: 'mark',
      mark: 'strike',
      icon: 'i-lucide-strikethrough',
      tooltip: { text: 'Strikethrough' }
    },
    {
      kind: 'mark',
      mark: 'code',
      icon: 'i-lucide-code',
      tooltip: { text: 'Inline code' }
    },
    { kind: 'link', icon: 'i-lucide-link', tooltip: { text: 'Link' } }
  ],
  [
    {
      kind: 'bulletList',
      icon: 'i-lucide-list',
      tooltip: { text: 'Bullet list' }
    },
    {
      kind: 'orderedList',
      icon: 'i-lucide-list-ordered',
      tooltip: { text: 'Numbered list' }
    },
    {
      kind: 'blockquote',
      icon: 'i-lucide-text-quote',
      tooltip: { text: 'Quote' }
    },
    {
      kind: 'codeBlock',
      icon: 'i-lucide-square-code',
      tooltip: { text: 'Code block' }
    },
    { kind: 'image', icon: 'i-lucide-image', tooltip: { text: 'Image (URL)' } }
  ]
]

async function save(nextStatus?: NoteStatus) {
  if (nextStatus) state.status = nextStatus
  if (!state.title.trim()) {
    toast.add({ title: 'Title is required', color: 'error' })
    return
  }
  saving.value = true
  try {
    const body = { ...state, slug: state.slug || undefined }
    const result = props.note
      ? await $fetch<AdminNote>(`/api/admin/notes/${props.note.id}`, {
          method: 'PUT',
          body
        })
      : await $fetch<AdminNote>('/api/admin/notes', { method: 'POST', body })

    Object.assign(state, fromNote(result))
    saved.value = JSON.stringify(state)
    toast.add({
      title:
        result.status === 'published' ? 'Saved & published' : 'Draft saved',
      description:
        result.status === 'published'
          ? 'Public page refreshes within a minute.'
          : undefined,
      color: 'success'
    })
    if (!props.note)
      await navigateTo(`/admin/notes/${result.id}`, { replace: true })
  } catch (e) {
    const err = e as {
      data?: { statusMessage?: string; message?: string }
      message: string
    }
    toast.add({
      title: 'Save failed',
      description: err.data?.statusMessage || err.data?.message || err.message,
      color: 'error'
    })
  } finally {
    saving.value = false
  }
}

onBeforeRouteLeave(() => {
  if (dirty.value && !saving.value) {
    return window.confirm('You have unsaved changes. Leave anyway?')
  }
})

function onBeforeUnload(e: BeforeUnloadEvent) {
  if (dirty.value) e.preventDefault()
}
onMounted(() => window.addEventListener('beforeunload', onBeforeUnload))
onBeforeUnmount(() =>
  window.removeEventListener('beforeunload', onBeforeUnload)
)
</script>

<template>
  <form class="grid gap-6 lg:grid-cols-[1fr_18rem]" @submit.prevent="save()">
    <div class="min-w-0 space-y-4">
      <UInput
        v-model="state.title"
        placeholder="Note title"
        size="xl"
        variant="none"
        class="w-full"
        :ui="{ base: 'px-0 text-3xl font-semibold font-display' }"
        aria-label="Title"
        autofocus
      />
      <div class="rounded-lg border border-(--ui-border)">
        <UEditor
          v-slot="{ editor }"
          v-model="state.content"
          content-type="markdown"
          placeholder="Write your note… (Markdown shortcuts work: ## heading, ``` code, - list)"
          :ui="{ base: 'min-h-[28rem] px-6 py-4' }"
        >
          <UEditorToolbar
            :editor="editor"
            :items="toolbarItems"
            class="sticky top-0 z-10 overflow-x-auto border-b border-(--ui-border) bg-(--ui-bg) px-2 py-1"
          />
        </UEditor>
      </div>
    </div>

    <aside class="space-y-4 lg:sticky lg:top-6 lg:self-start">
      <UFormField label="Status">
        <USelect v-model="state.status" :items="statusItems" class="w-full" />
      </UFormField>
      <UFormField label="Slug" :hint="`/notes/${state.slug || '…'}`">
        <UInput
          v-model="state.slug"
          class="w-full"
          @input="slugTouched = true"
        />
      </UFormField>
      <UFormField
        label="Description"
        help="One line shown under the title and in search results."
      >
        <UTextarea
          v-model="state.description"
          :rows="3"
          autoresize
          class="w-full"
        />
      </UFormField>
      <UFormField label="Tags" help="Press Enter to add.">
        <UInputTags
          v-model="state.tags"
          class="w-full"
          placeholder="e.g. vscode"
        />
      </UFormField>

      <div class="flex flex-col gap-2 pt-2">
        <UButton
          type="submit"
          block
          :loading="saving"
          :disabled="!dirty && !!note"
        >
          Save
        </UButton>
        <UButton
          v-if="state.status !== 'published'"
          block
          color="neutral"
          variant="outline"
          :loading="saving"
          icon="i-lucide-send"
          @click="save('published')"
        >
          Save &amp; publish
        </UButton>
        <UButton to="/admin" block color="neutral" variant="ghost"
          >Back to notes</UButton
        >
        <p v-if="dirty" class="text-center text-xs text-(--ui-text-muted)">
          Unsaved changes
        </p>
      </div>
    </aside>
  </form>
</template>
