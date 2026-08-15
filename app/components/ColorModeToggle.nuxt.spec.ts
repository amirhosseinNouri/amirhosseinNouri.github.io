import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ColorModeToggle from './ColorModeToggle.vue'

describe('ColorModeToggle', () => {
  it('renders a toggle button with an accessible label', async () => {
    const wrapper = await mountSuspended(ColorModeToggle)

    const button = wrapper.get('button')
    expect(button.attributes('aria-label')).toBeTruthy()
  })

  it('cycles the theme when clicked', async () => {
    const wrapper = await mountSuspended(ColorModeToggle)

    const before = wrapper.get('button').attributes('aria-label')
    await wrapper.get('button').trigger('click')
    const after = wrapper.get('button').attributes('aria-label')

    expect(before).toBeTruthy()
    expect(after).not.toBe(before)
  })
})
