import type { Project } from '~/types/project'

export const projects: Project[] = [
  {
    slug: 'momgen',
    name: 'Momgen',
    description:
      'Turns meeting recordings (MP3/MP4) into structured Minutes-of-Meeting markdown. Transcribes with ElevenLabs Scribe, summarizes with an LLM, strips silence and caches segments to cut transcription cost, and estimates cost before running.',
    image: '/images/projects/momgen.png',
    imageAlt: 'Preview of the Momgen app',
    tags: ['TypeScript', 'Bun', 'AI SDK', 'FFmpeg', 'CLI', 'Next.js'],
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/amirhosseinNouri/momgen',
        type: 'repo'
      },
      {
        label: 'Live demo',
        href: 'https://momgen-ai.vercel.app',
        type: 'demo'
      },
      {
        label: 'npm',
        href: 'https://www.npmjs.com/package/@amirhosseinnouri/momgen',
        type: 'package'
      }
    ],
    featured: true
  },
  {
    slug: 'voxgen',
    name: 'Voxgen',
    description:
      'Turns a text or Markdown file into a narrated audio file using Fish Audio TTS. Normalizes Markdown for natural narration, chunks text on sentence/paragraph boundaries, caches requests, runs up to 4 calls in parallel, and outputs WAV/MP3/Opus/FLAC/M4A.',
    image: '/images/projects/voxgen.png',
    imageAlt: 'Preview of the Voxgen app',
    tags: ['TypeScript', 'Bun', 'TTS', 'FFmpeg', 'CLI', 'Next.js'],
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/amirhosseinNouri/voxgen',
        type: 'repo'
      },
      {
        label: 'Live demo',
        href: 'https://voxgen-cli.vercel.app',
        type: 'demo'
      },
      {
        label: 'npm',
        href: 'https://www.npmjs.com/package/@amirhosseinnouri/voxgen',
        type: 'package'
      }
    ],
    featured: true
  }
]
