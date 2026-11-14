export type NoteStatus = 'draft' | 'published'

/** Lightweight row used by the public notes index. */
export interface NoteSummary {
  slug: string
  title: string
  description: string | null
  tags: string[]
  publishedAt: string | null
}

/** Full note as returned by the public detail endpoint. */
export interface PublicNote extends NoteSummary {
  content: string
  updatedAt: string
}

/** Full note as seen by the admin dashboard. */
export interface AdminNote extends PublicNote {
  id: number
  status: NoteStatus
  createdAt: string
}
