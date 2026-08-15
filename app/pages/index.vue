<script setup lang="ts">
useSeoMeta({
  title: 'Senior Software Engineer',
  description:
    'Senior Software Engineer at Snapp, building web products for 50M+ users. Open-source projects: Momgen (meeting minutes), Voxgen (text-to-audio).',
  ogTitle: 'Amir Nouri — Senior Software Engineer',
  ogDescription:
    'Senior Software Engineer at Snapp, building web products for 50M+ users. Open-source projects: Momgen (meeting minutes), Voxgen (text-to-audio).',
  ogType: 'website',
  ogUrl: 'https://amirhosseinnouri.github.io',
  ogImage: 'https://amirhosseinnouri.github.io/og.png',
  twitterCard: 'summary_large_image'
})

useHead({
  link: [{ rel: 'canonical', href: 'https://amirhosseinnouri.github.io' }]
})
</script>

<template>
  <main>
    <HeroSection />
    <ProjectsSection />
    <AboutSection />
    <ExperienceSection />
    <SkillsSection />
  </main>
</template>
