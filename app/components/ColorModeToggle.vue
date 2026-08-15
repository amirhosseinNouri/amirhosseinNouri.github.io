<script setup lang="ts">
const colorMode = useColorMode()

const modes = ['system', 'light', 'dark'] as const
type ColorMode = (typeof modes)[number]

interface ModeMeta {
  icon: string
  label: string
  next: ColorMode
}

const meta: Record<ColorMode, ModeMeta> = {
  system: {
    icon: 'i-lucide-monitor',
    label: 'Follows your system theme. Click to switch to light mode',
    next: 'light'
  },
  light: {
    icon: 'i-lucide-sun',
    label: 'Light mode active. Click to switch to dark mode',
    next: 'dark'
  },
  dark: {
    icon: 'i-lucide-moon',
    label: 'Dark mode active. Click to follow your system theme',
    next: 'system'
  }
}

const current = computed<ModeMeta>(() => {
  const { preference } = colorMode
  return meta[(modes as readonly string[]).includes(preference) ? (preference as ColorMode) : 'system']
})

function cycle() {
  colorMode.preference = current.value.next
}
</script>

<template>
  <UButton
    :aria-label="current.label"
    :title="current.label"
    color="neutral"
    variant="ghost"
    square
    class="theme-toggle size-9 rounded-full"
    @click="cycle"
  >
    <template #leading>
      <Transition name="theme-icon" mode="out-in">
        <Icon
          :key="current.icon"
          :name="current.icon"
          class="size-5"
          aria-hidden="true"
        />
      </Transition>
    </template>
  </UButton>
</template>

<style scoped>
.theme-toggle {
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.theme-icon-enter-active,
.theme-icon-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.theme-icon-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}

.theme-icon-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
}

@media (prefers-reduced-motion: reduce) {
  .theme-icon-enter-active,
  .theme-icon-leave-active {
    transition: none;
  }
}
</style>
