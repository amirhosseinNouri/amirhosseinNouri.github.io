<script setup lang="ts">
const { status, error } = useAdminAccess()
const clerk = useClerk()
const signOut = () => clerk.value?.signOut({ redirectUrl: '/' })
const route = useRoute()

const isSignIn = computed(() => route.path.startsWith('/admin/sign-in'))
</script>

<template>
  <div class="flex min-h-screen flex-col bg-(--ui-bg)">
    <header class="border-b border-(--ui-border) bg-(--ui-bg)/80 backdrop-blur">
      <UContainer class="flex h-14 items-center justify-between gap-4">
        <NuxtLink
          to="/admin"
          class="flex items-center gap-2 font-display font-medium text-(--ui-text-highlighted)"
        >
          <span
            class="grid size-7 place-items-center rounded-md bg-primary text-xs font-semibold text-inverted"
            >AN</span
          >
          Notes admin
        </NuxtLink>
        <div class="flex items-center gap-2">
          <UButton
            to="/notes"
            target="_blank"
            color="neutral"
            variant="ghost"
            size="sm"
            trailing-icon="i-lucide-external-link"
          >
            View site
          </UButton>
          <ColorModeToggle />
          <UserButton v-if="!isSignIn" />
        </div>
      </UContainer>
    </header>

    <UContainer class="flex-1 py-8">
      <slot v-if="isSignIn" />
      <div
        v-else-if="status === 'pending' || status === 'idle'"
        class="flex justify-center py-24"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="size-6 animate-spin text-(--ui-text-muted)"
        />
      </div>
      <UEmpty
        v-else-if="error"
        class="mx-auto max-w-lg"
        icon="i-lucide-shield-x"
        :title="
          error.statusCode === 403 ? 'Not authorized' : 'Something went wrong'
        "
        :description="
          error.statusCode === 403
            ? 'This account is not allowed to manage notes.'
            : error.statusMessage || 'Could not verify access.'
        "
        :actions="[
          {
            label: 'Sign out',
            color: 'neutral',
            variant: 'outline',
            onClick: signOut
          }
        ]"
      />
      <slot v-else />
    </UContainer>
  </div>
</template>
