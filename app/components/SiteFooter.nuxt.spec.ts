import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { socials } from '~/data/socials'
import SiteFooter from './SiteFooter.vue'

describe('SiteFooter', () => {
  it('renders one link per social in the registry', async () => {
    const wrapper = await mountSuspended(SiteFooter)

    const links = wrapper.findAll('[data-slot="base"]')
    expect(links).toHaveLength(socials.length)

    const hrefs = links.map((link) => link.attributes('href'))
    for (const social of socials) {
      expect(hrefs).toContain(social.href)
    }
  })

  it('opens external links in a new tab with rel=noopener noreferrer', async () => {
    const wrapper = await mountSuspended(SiteFooter)

    const external = socials.filter(
      (social) => !social.href.startsWith('mailto:')
    )

    for (const social of external) {
      const link = wrapper
        .findAll('[data-slot="base"]')
        .find((l) => l.attributes('href') === social.href)
      expect(link?.attributes('target')).toBe('_blank')
      expect(link?.attributes('rel')).toBe('noopener noreferrer')
    }
  })

  it('renders the mailto link without opening a new tab', async () => {
    const wrapper = await mountSuspended(SiteFooter)

    const email = socials.find((social) => social.href.startsWith('mailto:'))
    const link = wrapper
      .findAll('[data-slot="base"]')
      .find((l) => l.attributes('href') === email?.href)

    expect(link?.attributes('target')).toBeUndefined()
  })
})
