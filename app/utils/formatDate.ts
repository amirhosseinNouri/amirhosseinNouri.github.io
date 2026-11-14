const formatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC'
})

/** "Apr 2, 2025" — UTC so SSR and client agree. */
export function formatNoteDate(iso: string | null | undefined): string {
  return iso ? formatter.format(new Date(iso)) : ''
}
