import { desc, eq } from 'drizzle-orm'
import { notes } from '../../db/schema'
import { toSummary } from '../../utils/notes'

export default defineEventHandler(async () => {
  const rows = await useDb()
    .select({
      slug: notes.slug,
      title: notes.title,
      description: notes.description,
      tags: notes.tags,
      publishedAt: notes.publishedAt
    })
    .from(notes)
    .where(eq(notes.status, 'published'))
    .orderBy(desc(notes.publishedAt))
  return rows.map(toSummary)
})
