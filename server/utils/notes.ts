import type { AdminNote, NoteSummary, PublicNote } from '#shared/types/note'
import type { NoteRow } from '../db/schema'

const iso = (d: Date | null) => (d ? d.toISOString() : null)

export function toSummary(
  row: Pick<NoteRow, 'slug' | 'title' | 'description' | 'tags' | 'publishedAt'>
): NoteSummary {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    tags: row.tags,
    publishedAt: iso(row.publishedAt)
  }
}

export function toPublicNote(row: NoteRow): PublicNote {
  return {
    ...toSummary(row),
    content: row.content,
    updatedAt: row.updatedAt.toISOString()
  }
}

export function toAdminNote(row: NoteRow): AdminNote {
  return {
    ...toPublicNote(row),
    id: row.id,
    status: row.status,
    createdAt: row.createdAt.toISOString()
  }
}

/** Parse a positive integer route param or throw 400. */
export function getNoteId(event: Parameters<typeof getRouterParam>[0]): number {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid note id' })
  }
  return id
}

/** Postgres unique-violation → 409. Neon wraps errors, so check `cause` too. */
export function isUniqueViolation(error: unknown): boolean {
  const e = error as { code?: string; cause?: { code?: string } }
  return e?.code === '23505' || e?.cause?.code === '23505'
}
