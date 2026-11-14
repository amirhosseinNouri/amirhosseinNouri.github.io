<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useSeoMeta({ title: 'New note', robots: 'noindex, nofollow' })
</script>

<template>
  <AdminNoteForm />
</template>
