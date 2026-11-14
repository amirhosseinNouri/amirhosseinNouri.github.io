import { desc, eq } from 'drizzle-orm'
import { notes } from '../../db/schema'

export default defineSitemapEventHandler(async () => {
  const rows = await useDb()
    .select({ slug: notes.slug, updatedAt: notes.updatedAt })
    .from(notes)
    .where(eq(notes.status, 'published'))
    .orderBy(desc(notes.publishedAt))
  return rows.map((r) => ({ loc: `/notes/${r.slug}`, lastmod: r.updatedAt }))
})
