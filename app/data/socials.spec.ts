import { describe, expect, it } from 'vitest'
import { socials } from './socials'

describe('socials registry', () => {
  it('has at least one social', () => {
    expect(socials.length).toBeGreaterThan(0)
  })

  it('has unique labels', () => {
    const labels = socials.map((social) => social.label)
    expect(new Set(labels).size).toBe(labels.length)
  })

  it('has non-empty hrefs that parse', () => {
    for (const social of socials) {
      expect(social.href, social.label).not.toBe('')
      if (social.href.startsWith('mailto:')) {
        expect(social.href).toMatch(/^mailto:[^@\s]+@[^@\s]+\.[^@\s]+$/)
      } else {
        expect(() => new URL(social.href), social.label).not.toThrow()
      }
    }
  })

  it('labels every expected platform', () => {
    expect(socials.map((social) => social.label)).toEqual(
      expect.arrayContaining(['LinkedIn', 'GitHub', 'X', 'Telegram', 'Email'])
    )
  })

  it('keeps the X and Telegram handles verbatim (distinct spelling and case)', () => {
    const x = socials.find((social) => social.label === 'X')
    const telegram = socials.find((social) => social.label === 'Telegram')

    expect(x?.href).toBe('https://x.com/amirhosein_nr')
    expect(telegram?.href).toBe('https://t.me/Amirhossein_nr')
    expect(x?.href).not.toBe(telegram?.href)
  })
})
