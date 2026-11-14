import {
  index,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp
} from 'drizzle-orm/pg-core'

export const noteStatus = pgEnum('note_status', ['draft', 'published'])

export const notes = pgTable(
  'notes',
  {
    id: serial('id').primaryKey(),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    description: text('description'),
    content: text('content').notNull().default(''),
    tags: text('tags').array().notNull().default([]),
    status: noteStatus('status').notNull().default('draft'),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (t) => [index('notes_status_published_at_idx').on(t.status, t.publishedAt)]
)

export type NoteRow = typeof notes.$inferSelect
