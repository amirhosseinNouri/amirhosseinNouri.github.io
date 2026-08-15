<script setup lang="ts">
withDefaults(
  defineProps<{
    as?: string
  }>(),
  {
    as: 'div'
  }
)
</script>

<template>
  <UContainer :as="as">
    <slot />
  </UContainer>
</template>
