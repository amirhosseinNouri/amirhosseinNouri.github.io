import { and, eq } from 'drizzle-orm'
import { notes } from '../../db/schema'
import { toPublicNote } from '../../utils/notes'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const [row] = await useDb()
    .select()
    .from(notes)
    .where(and(eq(notes.slug, slug), eq(notes.status, 'published')))
    .limit(1)
  if (!row) {
    throw createError({ statusCode: 404, statusMessage: 'Note not found' })
  }
  return toPublicNote(row)
})
