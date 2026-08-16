<script setup lang="ts">
const route = useRoute()

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Blog', to: '/blog' }
]

function isActive(to: string) {
  return to === '/' ? route.path === '/' : route.path === to || route.path.startsWith(to + '/')
}
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-default bg-default/75 backdrop-blur-md"
  >
    <AppContainer class="flex h-16 items-center justify-between">
      <NuxtLink
        to="/"
        class="group flex items-center gap-2.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-label="Amir Nouri — home"
      >
        <span
          class="grid size-8 place-items-center rounded-lg bg-primary font-display text-sm font-semibold text-inverted transition-transform duration-200 group-hover:-rotate-6 motion-reduce:transition-none motion-reduce:group-hover:rotate-0"
        >
          AN
        </span>
        <span
          class="hidden font-display text-base font-medium tracking-tight text-highlighted sm:inline"
        >
          Amir Nouri
        </span>
      </NuxtLink>

      <nav class="flex items-center gap-1" aria-label="Primary">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :data-active="isActive(item.to) || undefined"
          :aria-current="isActive(item.to) ? 'page' : undefined"
          class="relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          :class="
            isActive(item.to)
              ? 'text-highlighted after:absolute after:inset-x-3 after:bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary'
              : 'text-muted hover:bg-elevated/60 hover:text-highlighted'
          "
        >
          {{ item.label }}
        </NuxtLink>
        <ColorModeToggle class="ml-1" />
      </nav>
    </AppContainer>
  </header>
</template>
