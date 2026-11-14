/** Turn an arbitrary title into a URL-safe slug. */
export function slugify(input: string): string {
  return (
    input
      .normalize('NFKD')
      // Drop combining diacritical marks left over from NFKD (é → e).
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s_-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80)
  )
}
