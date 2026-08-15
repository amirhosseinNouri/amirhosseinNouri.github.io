import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { projects } from '~/data/projects'
import type { Project } from '~/types/project'
import ProjectsSection from './ProjectsSection.vue'

describe('ProjectsSection', () => {
  it('renders the section heading', async () => {
    const wrapper = await mountSuspended(ProjectsSection)

    expect(wrapper.get('h2').text()).toBe('Projects')
  })

  it('renders one card per project in the registry', async () => {
    const wrapper = await mountSuspended(ProjectsSection)

    expect(wrapper.findAll('article')).toHaveLength(projects.length)
  })

  it('keys every card by slug', async () => {
    const wrapper = await mountSuspended(ProjectsSection)

    for (const project of projects) {
      expect(wrapper.find(`#project-${project.slug}`).exists()).toBe(true)
    }
  })

  it('renders a single link for a repo-only project', async () => {
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
    const wrapper = await mountSuspended(ProjectsSection, {
      props: { projects: [repoOnly] }
    })

    expect(wrapper.findAll('article')).toHaveLength(1)
    const links = wrapper.findAll('a[data-slot="base"]')
    expect(links).toHaveLength(1)
    expect(links[0]!.text()).toContain('View source')
    expect(links[0]!.attributes('href')).toBe(
      'https://github.com/amirhosseinNouri/repo-only'
    )
  })
})
