import { describe, expect, it } from 'vitest'
import { noteInputSchema } from './noteInput'

describe('noteInputSchema', () => {
  it('derives the slug from the title and applies defaults', () => {
    const out = noteInputSchema.parse({ title: 'Hello World' })
    expect(out).toMatchObject({
      slug: 'hello-world',
      content: '',
      tags: [],
      status: 'draft',
      description: null
    })
  })

  it('keeps an explicit slug and dedupes/normalises tags', () => {
    const out = noteInputSchema.parse({
      title: 'x',
      slug: 'custom-slug',
      tags: ['VSCode', 'vscode', ' python ']
    })
    expect(out.slug).toBe('custom-slug')
    expect(out.tags).toEqual(['vscode', 'python'])
  })

  it('rejects an invalid slug', () => {
    expect(
      noteInputSchema.safeParse({ title: 'x', slug: 'Bad Slug' }).success
    ).toBe(false)
  })

  it('rejects a missing title or an unknown status', () => {
    expect(noteInputSchema.safeParse({ title: '  ' }).success).toBe(false)
    expect(
      noteInputSchema.safeParse({ title: 'x', status: 'archived' }).success
    ).toBe(false)
  })

  it('fails when no slug can be derived', () => {
    expect(noteInputSchema.safeParse({ title: '!!!' }).success).toBe(false)
  })
})
