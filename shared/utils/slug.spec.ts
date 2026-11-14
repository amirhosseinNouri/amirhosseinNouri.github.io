import { describe, expect, it } from 'vitest'
import { slugify } from './slug'

describe('slugify', () => {
  it('lowercases and dashes words', () => {
    expect(slugify('How to use debugpy in VSCode')).toBe(
      'how-to-use-debugpy-in-vscode'
    )
  })

  it('strips accents and punctuation', () => {
    expect(slugify('Café: déjà vu!?')).toBe('cafe-deja-vu')
  })

  it('collapses separators and trims dashes', () => {
    expect(slugify('  --a__b   c-- ')).toBe('a-b-c')
  })

  it('returns empty string when nothing usable remains', () => {
    expect(slugify('!!!')).toBe('')
  })
})
