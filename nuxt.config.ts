// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    'nuxt-gtag',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots'
  ],
  site: {
    url: 'https://amirhosseinnouri.github.io'
  },
  nitro: {
    prerender: {
      routes: ['/projects/momgen', '/projects/voxgen']
    }
  },
  robots: {
    groups: [{ userAgent: '*', disallow: [] }]
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
