<script setup lang="ts">
import { socials } from '~/data/socials'

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

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Amir Nouri',
  jobTitle: 'Senior Software Engineer',
  url: 'https://amirhosseinnouri.github.io',
  sameAs: socials
    .filter(social => social.href.startsWith('http'))
    .map(social => social.href),
}

useHead({
  link: [{ rel: 'canonical', href: 'https://amirhosseinnouri.github.io' }],
  script: [
    {
      type: 'application/ld+json',
      textContent: JSON.stringify(personSchema),
    },
  ],
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
