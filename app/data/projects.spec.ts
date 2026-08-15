import { describe, expect, it } from 'vitest'

import { projects } from '~/data/projects'

describe('projects registry', () => {
  it('has non-empty unique slugs', () => {
    const slugs = projects.map((project) => project.slug)
    expect(slugs.length).toBeGreaterThan(0)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) {
      expect(slug.trim()).not.toBe('')
    }
  })

  it('gives every project at least one link', () => {
    for (const project of projects) {
      expect(project.links.length).toBeGreaterThanOrEqual(1)
    }
  })

  it('gives every project a non-empty image path starting with /', () => {
    for (const project of projects) {
      expect(project.image.trim()).not.toBe('')
      expect(project.image.startsWith('/')).toBe(true)
    }
  })

  it('gives every link a valid URL', () => {
    for (const project of projects) {
      for (const link of project.links) {
        expect(() => new URL(link.href)).not.toThrow()
      }
    }
  })
})
