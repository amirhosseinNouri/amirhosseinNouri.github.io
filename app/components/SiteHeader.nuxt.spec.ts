import { describe, expect, it, vi } from 'vitest'
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import SiteHeader from './SiteHeader.vue'

const { pathMock } = vi.hoisted(() => ({ pathMock: vi.fn(() => '/') }))

mockNuxtImport('useRoute', () => () => ({ path: pathMock() }))

describe('SiteHeader', () => {
  it('renders the monogram home link and both nav items', async () => {
    const wrapper = await mountSuspended(SiteHeader)

    const home = wrapper.find('a[href="/"][aria-label]')
    expect(home.exists()).toBe(true)
    expect(home.text()).toContain('AN')

    const links = wrapper.findAll('nav a[href]')
    const hrefs = links.map((link) => link.attributes('href'))
    expect(hrefs).toContain('/')
    expect(hrefs).toContain('/blog')
  })

  it('marks the Home link as active on the home route', async () => {
    pathMock.mockReturnValue('/')
    const wrapper = await mountSuspended(SiteHeader)

    const home = wrapper.find('nav a[href="/"]')
    const blog = wrapper.find('nav a[href="/blog"]')
    expect(home.attributes('data-active')).toBe('true')
    expect(blog.attributes('data-active')).toBeUndefined()
  })

  it('marks the Blog link as active on the blog route', async () => {
    pathMock.mockReturnValue('/blog')
    const wrapper = await mountSuspended(SiteHeader)

    const home = wrapper.find('nav a[href="/"]')
    const blog = wrapper.find('nav a[href="/blog"]')
    expect(blog.attributes('data-active')).toBe('true')
    expect(home.attributes('data-active')).toBeUndefined()
  })
})
