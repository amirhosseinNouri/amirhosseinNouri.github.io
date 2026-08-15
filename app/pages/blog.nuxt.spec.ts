import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BlogPage from './blog.vue'

describe('blog page', () => {
  it('renders a single h1', async () => {
    const wrapper = await mountSuspended(BlogPage)

    const headings = wrapper.findAll('h1')
    expect(headings).toHaveLength(1)
    expect(headings[0]!.text()).toBe('Blog')
  })

  it('renders the coming-soon placeholder with a link back home', async () => {
    const wrapper = await mountSuspended(BlogPage)

    expect(wrapper.text()).toContain('Coming soon')
    expect(wrapper.find('a[href="/"]').exists()).toBe(true)
  })
})
