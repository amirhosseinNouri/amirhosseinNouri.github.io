<script setup lang="ts">
useSeoMeta({
  title: 'Blog | Amir Nouri',
  description:
    'Write-ups on frontend engineering, design systems, and building at scale — coming soon.'
})
</script>

<template>
  <main
    class="flex min-h-[70vh] items-center justify-center px-4 py-24 sm:py-32"
  >
    <h1 class="sr-only">Blog</h1>
    <UContainer class="flex justify-center">
      <UEmpty
        title="Coming soon"
        description="Write-ups on frontend engineering, design systems, and building at scale — the first posts are on the way."
        :actions="[
          {
            label: 'Back to home',
            to: '/',
            color: 'primary',
            variant: 'solid',
            size: 'lg'
          }
        ]"
        variant="soft"
        size="lg"
      >
        <template #leading>
          <span
            class="flex size-14 items-center justify-center rounded-full bg-(--ui-primary)/10 text-(--ui-primary) sm:size-16"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-6 sm:size-7"
              aria-hidden="true"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </span>
        </template>
      </UEmpty>
    </UContainer>
  </main>
</template>
