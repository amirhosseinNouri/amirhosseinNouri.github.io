import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { skillGroups } from '~/data/skills'
import SkillsSection from './SkillsSection.vue'

describe('SkillsSection', () => {
  it('renders the section heading', async () => {
    const wrapper = await mountSuspended(SkillsSection)

    expect(wrapper.get('h2').text()).toBe('Skills')
  })

  it('renders one chip per skill across all groups', async () => {
    const wrapper = await mountSuspended(SkillsSection)

    const totalSkills = skillGroups.reduce(
      (sum, group) => sum + group.skills.length,
      0
    )

    expect(wrapper.findAll('[data-slot="base"]')).toHaveLength(totalSkills)
  })

  it('labels every group and lists its skills', async () => {
    const wrapper = await mountSuspended(SkillsSection)

    for (const group of skillGroups) {
      expect(wrapper.text()).toContain(group.category)
      for (const skill of group.skills) {
        expect(wrapper.text()).toContain(skill)
      }
    }
  })
})
