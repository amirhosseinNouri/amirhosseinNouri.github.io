import { eq } from 'drizzle-orm'
import { notes } from '../../../db/schema'
import { getNoteId, toAdminNote } from '../../../utils/notes'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getNoteId(event)
  const [row] = await useDb()
    .select()
    .from(notes)
    .where(eq(notes.id, id))
    .limit(1)
  if (!row)
    throw createError({ statusCode: 404, statusMessage: 'Note not found' })
  return toAdminNote(row)
})
