import { eq } from 'drizzle-orm'
import { noteInputSchema } from '#shared/utils/noteInput'
import { notes } from '../../../db/schema'
import { getNoteId, isUniqueViolation, toAdminNote } from '../../../utils/notes'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getNoteId(event)
  const input = await readValidatedBody(event, noteInputSchema.parse)
  const db = useDb()

  const [existing] = await db
    .select({ publishedAt: notes.publishedAt })
    .from(notes)
    .where(eq(notes.id, id))
    .limit(1)
  if (!existing)
    throw createError({ statusCode: 404, statusMessage: 'Note not found' })

  // Keep the original publish date; set it the first time a note goes live.
  const publishedAt =
    input.status === 'published'
      ? (existing.publishedAt ?? new Date())
      : existing.publishedAt

  try {
    const [row] = await db
      .update(notes)
      .set({ ...input, publishedAt, updatedAt: new Date() })
      .where(eq(notes.id, id))
      .returning()
    return toAdminNote(row!)
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw createError({
        statusCode: 409,
        statusMessage: 'A note with this slug already exists'
      })
    }
    throw error
  }
})
