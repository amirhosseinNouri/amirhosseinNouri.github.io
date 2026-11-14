import { desc } from 'drizzle-orm'
import { notes } from '../../../db/schema'
import { toAdminNote } from '../../../utils/notes'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const rows = await useDb().select().from(notes).orderBy(desc(notes.updatedAt))
  return rows.map(toAdminNote)
})
