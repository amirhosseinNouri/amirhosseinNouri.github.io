import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { experiences } from '~/data/experience'
import ExperienceSection from './ExperienceSection.vue'

describe('ExperienceSection', () => {
  it('renders every company in the registry', async () => {
    const wrapper = await mountSuspended(ExperienceSection)

    for (const experience of experiences) {
      expect(wrapper.text()).toContain(experience.company)
    }
  })

  it('renders every role with its date range', async () => {
    const wrapper = await mountSuspended(ExperienceSection)

    for (const experience of experiences) {
      for (const role of experience.roles) {
        expect(wrapper.text()).toContain(role.title)
        expect(wrapper.text()).toContain(`${role.start} – ${role.end}`)
      }
    }
  })
})
