import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import IndexPage from './index.vue'

describe('index page', () => {
  it('renders every home section', async () => {
    const wrapper = await mountSuspended(IndexPage)

    const ids = wrapper
      .findAll('main section[id]')
      .map((section) => section.attributes('id'))

    expect(ids).toEqual(['projects', 'about', 'experience', 'skills'])
  })

  it('renders a single h1 (the hero name)', async () => {
    const wrapper = await mountSuspended(IndexPage)

    const headings = wrapper.findAll('h1')
    expect(headings).toHaveLength(1)
    expect(headings[0]!.text()).toBe('Amir Nouri')
  })

  it('renders sections in the planned order: hero first, skills last', async () => {
    const wrapper = await mountSuspended(IndexPage)

    const order = ['Amir Nouri', 'Projects', 'About', 'Experience', 'Skills'].map(
      (text) => wrapper.text().indexOf(text)
    )

    expect(order.every((index) => index >= 0)).toBe(true)
    for (let i = 1; i < order.length; i++) {
      expect(order[i]!).toBeGreaterThan(order[i - 1]!)
    }
  })
})
