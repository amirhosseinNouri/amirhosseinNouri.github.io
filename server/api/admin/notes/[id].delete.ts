import { eq } from 'drizzle-orm'
import { notes } from '../../../db/schema'
import { getNoteId } from '../../../utils/notes'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getNoteId(event)
  const deleted = await useDb()
    .delete(notes)
    .where(eq(notes.id, id))
    .returning({ id: notes.id })
  if (!deleted.length)
    throw createError({ statusCode: 404, statusMessage: 'Note not found' })
  setResponseStatus(event, 204)
  return null
})
