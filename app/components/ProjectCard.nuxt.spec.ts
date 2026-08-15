import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { projects } from '~/data/projects'
import type { Project } from '~/types/project'
import ProjectCard from './ProjectCard.vue'

describe('ProjectCard', () => {
  it('renders name, description, tags, and one button per link', async () => {
    const project = projects.find((p) => p.slug === 'momgen')!
    const wrapper = await mountSuspended(ProjectCard, { props: { project } })

    expect(wrapper.text()).toContain(project.name)
    expect(wrapper.text()).toContain(project.description)
    for (const tag of project.tags) {
      expect(wrapper.text()).toContain(tag)
    }

    const links = wrapper.findAll('a[data-slot="base"]')
    expect(links).toHaveLength(project.links.length)
    for (const link of project.links) {
      expect(wrapper.find(`a[href="${link.href}"]`).exists()).toBe(true)
    }
  })

  it('renders exactly one correctly-labeled button for a repo-only project', async () => {
    const repoOnly: Project = {
      slug: 'repo-only',
      name: 'Repo Only',
      description: 'A project with no demo.',
      image: '/images/projects/repo-only.png',
      imageAlt: 'Preview of the Repo Only project',
      tags: ['TypeScript'],
      links: [
        {
          label: 'View source',
          href: 'https://github.com/amirhosseinNouri/repo-only',
          type: 'repo'
        }
      ]
    }
    const wrapper = await mountSuspended(ProjectCard, {
      props: { project: repoOnly }
    })

    const links = wrapper.findAll('a[data-slot="base"]')
    expect(links).toHaveLength(1)
    const link = links[0]!
    expect(link.text()).toContain('View source')
    expect(link.attributes('href')).toBe(
      'https://github.com/amirhosseinNouri/repo-only'
    )
  })

  it('opens external links in a new tab with rel=noopener noreferrer', async () => {
    const project = projects[0]!
    const wrapper = await mountSuspended(ProjectCard, { props: { project } })

    for (const link of project.links) {
      const anchor = wrapper.find(`a[href="${link.href}"]`)
      expect(anchor.attributes('target')).toBe('_blank')
      expect(anchor.attributes('rel')).toBe('noopener noreferrer')
    }
  })
})
