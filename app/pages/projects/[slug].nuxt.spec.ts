import { describe, expect, it, vi } from 'vitest'
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { projects } from '~/data/projects'
import ProjectDetailPage from './[slug].vue'

const { slugMock } = vi.hoisted(() => ({ slugMock: vi.fn(() => 'momgen') }))

mockNuxtImport('useRoute', () => () => ({ params: { slug: slugMock() } }))

describe('project detail page', () => {
  it('renders a known project with a single h1, description, and its links', async () => {
    slugMock.mockReturnValue('momgen')
    const project = projects.find((p) => p.slug === 'momgen')!
    const wrapper = await mountSuspended(ProjectDetailPage)

    const headings = wrapper.findAll('h1')
    expect(headings).toHaveLength(1)
    expect(headings[0]!.text()).toBe(project.name)

    expect(wrapper.text()).toContain(project.description)
    for (const tag of project.tags) {
      expect(wrapper.text()).toContain(tag)
    }
    for (const link of project.links) {
      expect(wrapper.find(`a[href="${link.href}"]`).exists()).toBe(true)
    }
    expect(wrapper.find('a[href="/#projects"]').exists()).toBe(true)
  })

  it('shows the not-found state with links home and to projects for an unknown slug', async () => {
    slugMock.mockReturnValue('nope')
    const wrapper = await mountSuspended(ProjectDetailPage)

    expect(wrapper.text()).toContain('Project not found')
    expect(wrapper.findAll('h1')).toHaveLength(1)
    expect(wrapper.find('a[href="/"]').exists()).toBe(true)
    expect(wrapper.find('a[href="/#projects"]').exists()).toBe(true)
  })
})
