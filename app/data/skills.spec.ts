import { describe, expect, it } from 'vitest'
import { skillGroups } from './skills'

describe('skills registry', () => {
  it('keeps the six groups from the plan', () => {
    expect(skillGroups).toHaveLength(6)
  })

  it('names the expected categories in order', () => {
    expect(skillGroups.map((group) => group.category)).toEqual([
      'Languages & Runtimes',
      'Frontend',
      'Architecture',
      'APIs & Real-Time',
      'Testing',
      'DevOps & Cloud'
    ])
  })

  it('has unique, non-empty categories', () => {
    const categories = skillGroups.map((group) => group.category)
    expect(new Set(categories).size).toBe(categories.length)
    for (const category of categories) {
      expect(category).not.toBe('')
    }
  })

  it('every group has non-empty, unique skills', () => {
    for (const group of skillGroups) {
      expect(group.skills.length, group.category).toBeGreaterThan(0)
      expect(new Set(group.skills).size, group.category).toBe(
        group.skills.length
      )
      for (const skill of group.skills) {
        expect(skill, group.category).not.toBe('')
      }
    }
  })
})
