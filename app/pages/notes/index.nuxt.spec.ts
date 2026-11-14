import { describe, expect, it, vi } from 'vitest'
import {
  mockNuxtImport,
  mountSuspended,
  registerEndpoint
} from '@nuxt/test-utils/runtime'
import NotesIndex from './index.vue'

const { queryMock } = vi.hoisted(() => ({ queryMock: vi.fn(() => ({})) }))

mockNuxtImport('useRoute', () => () => ({ path: '/notes', query: queryMock() }))

const notes = [
  {
    slug: 'newest',
    title: 'Newest note',
    description: null,
    tags: ['vscode'],
    publishedAt: '2025-04-02T00:00:00.000Z'
  },
  {
    slug: 'older',
    title: 'Older note',
    description: null,
    tags: ['openai'],
    publishedAt: '2025-03-15T00:00:00.000Z'
  }
]

registerEndpoint('/api/notes', () => notes)

describe('notes index page', () => {
  it('renders a single h1 and every note in API order with its date', async () => {
    queryMock.mockReturnValue({})
    const wrapper = await mountSuspended(NotesIndex)

    expect(wrapper.findAll('h1').map((h) => h.text())).toEqual(['Notes'])
    const rows = wrapper.findAll('[data-testid="notes-list"] li')
    expect(rows.map((r) => r.text())).toEqual([
      expect.stringContaining('Newest note'),
      expect.stringContaining('Older note')
    ])
    expect(rows[0]!.text()).toContain('Apr 2, 2025')
    expect(rows[0]!.find('a').attributes('href')).toBe('/notes/newest')
  })

  it('shows tag filters with counts', async () => {
    queryMock.mockReturnValue({})
    const wrapper = await mountSuspended(NotesIndex)
    const text = wrapper.find('[role="group"]').text()
    expect(text).toContain('All (2)')
    expect(text).toContain('vscode (1)')
    expect(text).toContain('openai (1)')
  })

  it('filters by the ?tag= query', async () => {
    queryMock.mockReturnValue({ tag: 'openai' })
    const wrapper = await mountSuspended(NotesIndex)
    const rows = wrapper.findAll('[data-testid="notes-list"] li')
    expect(rows).toHaveLength(1)
    expect(rows[0]!.text()).toContain('Older note')
  })

  it('shows an empty state when the tag matches nothing', async () => {
    queryMock.mockReturnValue({ tag: 'nope' })
    const wrapper = await mountSuspended(NotesIndex)
    expect(wrapper.find('[data-testid="notes-list"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('No notes yet')
  })
})
