<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useSeoMeta({ title: 'Sign in', robots: 'noindex, nofollow' })
</script>

<template>
  <div class="flex justify-center py-12">
    <SignIn
      path="/admin/sign-in"
      routing="path"
      fallback-redirect-url="/admin"
    />
  </div>
</template>
