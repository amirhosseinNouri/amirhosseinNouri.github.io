// https://nuxt.com/docs/api/configuration/nuxt-config
import { projects } from './app/data/projects'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    'nuxt-gtag',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxtjs/mdc',
    // Clerk boots a browser SDK that needs real keys; component tests don't
    // render admin pages, so skip it under Vitest.
    ...(process.env.VITEST ? [] : ['@clerk/nuxt'])
  ],
  site: {
    url: process.env.NUXT_SITE_URL || 'https://amirhosseinnouri.vercel.app'
  },
  runtimeConfig: {
    // Filled from NUXT_DATABASE_URL / NUXT_ADMIN_EMAIL at runtime.
    databaseUrl: '',
    adminEmail: ''
  },
  clerk: {
    signInUrl: '/admin/sign-in',
    signInFallbackRedirectUrl: '/admin'
  },
  mdc: {
    highlight: {
      theme: { default: 'github-light', dark: 'github-dark' },
      langs: [
        'bash',
        'shell',
        'json',
        'yaml',
        'js',
        'ts',
        'tsx',
        'jsx',
        'vue',
        'html',
        'css',
        'python',
        'go',
        'rust',
        'sql',
        'diff',
        'md',
        'dockerfile'
      ]
    },
    headings: { anchorLinks: { h2: true, h3: true, h4: true } }
  },
  routeRules: {
    '/': { prerender: true },
    '/projects/**': { prerender: true },
    // Rendered on demand and cached at the edge; picks up admin edits within ~60s.
    '/notes': { isr: 60 },
    '/notes/**': { isr: 60 },
    '/blog': { redirect: { to: '/notes', statusCode: 301 } },
    '/admin': { ssr: false, robots: false },
    '/admin/**': { ssr: false, robots: false },
    '/api/admin/**': { cache: false, headers: { 'cache-control': 'no-store' } }
  },
  nitro: {
    prerender: {
      routes: projects.map((p) => `/projects/${p.slug}`)
    }
  },
  sitemap: {
    sources: ['/api/__sitemap__/notes'],
    exclude: ['/admin/**', '/blog']
  },
  robots: {
    groups: [{ userAgent: '*', disallow: ['/admin', '/api/admin'] }]
  },
  gtag: {
    id: process.env.NUXT_PUBLIC_GTAG_ID || 'G-8NCFLTG53R',
    enabled: process.env.NODE_ENV === 'production'
  },
  typescript: {
    strict: true,
    typeCheck: true
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'Amir Nouri — Senior Software Engineer',
      titleTemplate: '%s · Amir Nouri',
      meta: [
        {
          name: 'description',
          content:
            'Senior Software Engineer at Snapp, building web products for 50M+ users. Open-source projects: Momgen (meeting minutes), Voxgen (text-to-audio).'
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Amir Nouri' },
        {
          property: 'og:image',
          content: 'https://amirhosseinnouri.github.io/og.png'
        },
        { name: 'twitter:card', content: 'summary_large_image' }
      ]
    }
  }
})
