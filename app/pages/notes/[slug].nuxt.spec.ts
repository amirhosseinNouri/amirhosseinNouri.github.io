import { describe, expect, it, vi } from 'vitest'
import {
  mockNuxtImport,
  mountSuspended,
  registerEndpoint
} from '@nuxt/test-utils/runtime'
import NotePage from './[slug].vue'

const { slugMock } = vi.hoisted(() => ({ slugMock: vi.fn(() => 'debugpy') }))

mockNuxtImport('useRoute', () => () => ({
  path: `/notes/${slugMock()}`,
  params: { slug: slugMock() },
  query: {}
}))

registerEndpoint('/api/notes/debugpy', () => ({
  slug: 'debugpy',
  title: 'How to use debugpy in VSCode',
  description: 'Attach the debugger to a running script.',
  tags: ['vscode'],
  publishedAt: '2025-04-02T00:00:00.000Z',
  updatedAt: '2025-04-03T00:00:00.000Z',
  content:
    '## Install\n\nRun this:\n\n```bash\npip install debugpy\n```\n\n## Attach\n\nThen attach.'
}))

describe('note detail page', () => {
  it('renders the title, meta and markdown body', async () => {
    slugMock.mockReturnValue('debugpy')
    const wrapper = await mountSuspended(NotePage)

    expect(wrapper.find('h1').text()).toBe('How to use debugpy in VSCode')
    expect(wrapper.text()).toContain('Attach the debugger to a running script.')
    expect(wrapper.text()).toContain('Apr 2, 2025')
    expect(wrapper.find('a[href="/notes?tag=vscode"]').exists()).toBe(true)

    const body = wrapper.find('[data-testid="note-body"]')
    expect(body.text()).toContain('pip install debugpy')
  })

  it('renders a table of contents from the headings', async () => {
    slugMock.mockReturnValue('debugpy')
    const wrapper = await mountSuspended(NotePage)
    const toc = wrapper.find('nav[aria-label="Contents"]')
    expect(toc.exists()).toBe(true)
    expect(toc.findAll('a').map((a) => a.attributes('href'))).toEqual([
      '#install',
      '#attach'
    ])
  })
})
