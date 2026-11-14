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
    expect(hrefs).toContain('/notes')
    expect(hrefs).not.toContain('/blog')
  })

  it('marks the Home link as active on the home route', async () => {
    pathMock.mockReturnValue('/')
    const wrapper = await mountSuspended(SiteHeader)

    const home = wrapper.find('nav a[href="/"]')
    const notes = wrapper.find('nav a[href="/notes"]')
    expect(home.attributes('data-active')).toBe('true')
    expect(home.attributes('aria-current')).toBe('page')
    expect(notes.attributes('data-active')).toBeUndefined()
    expect(notes.attributes('aria-current')).toBeUndefined()
  })

  it('marks the Notes link as active on the notes route', async () => {
    pathMock.mockReturnValue('/notes')
    const wrapper = await mountSuspended(SiteHeader)

    const home = wrapper.find('nav a[href="/"]')
    const notes = wrapper.find('nav a[href="/notes"]')
    expect(notes.attributes('data-active')).toBe('true')
    expect(notes.attributes('aria-current')).toBe('page')
    expect(home.attributes('data-active')).toBeUndefined()
    expect(home.attributes('aria-current')).toBeUndefined()
  })

  it('does not mark the Notes link active on a sibling segment', async () => {
    pathMock.mockReturnValue('/notesy')
    const wrapper = await mountSuspended(SiteHeader)

    const notes = wrapper.find('nav a[href="/notes"]')
    expect(notes.attributes('data-active')).toBeUndefined()
    expect(notes.attributes('aria-current')).toBeUndefined()
  })

  it('marks the Notes link active on a nested notes route', async () => {
    pathMock.mockReturnValue('/notes/post')
    const wrapper = await mountSuspended(SiteHeader)

    const notes = wrapper.find('nav a[href="/notes"]')
    expect(notes.attributes('data-active')).toBe('true')
    expect(notes.attributes('aria-current')).toBe('page')
  })
})
