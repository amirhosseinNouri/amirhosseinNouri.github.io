import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import HeroSection from './HeroSection.vue'

describe('HeroSection', () => {
  it('renders name, title, location, and positioning line', async () => {
    const wrapper = await mountSuspended(HeroSection)

    expect(wrapper.text()).toContain('Amir Nouri')
    expect(wrapper.text()).toContain('Senior Software Engineer')
    expect(wrapper.text()).toContain('Istanbul, Turkey')
    expect(wrapper.text()).toContain(
      'Building and scaling web products for 50M+ users'
    )
  })

  it('links to the resume PDF with a download attribute', async () => {
    const wrapper = await mountSuspended(HeroSection)

    const resumeLink = wrapper
      .findAll('a[href="/Amir_Nouri_Resume.pdf"]')
      .find(
        (a: { attributes: (name: string) => string | undefined }) =>
          a.attributes('download') !== undefined
      )

    expect(resumeLink).toBeTruthy()
    expect(resumeLink!.text()).toContain('Download Resume')
  })
})
