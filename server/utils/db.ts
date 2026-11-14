import { neon } from '@neondatabase/serverless'
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http'
import * as schema from '../db/schema'

let db: NeonHttpDatabase<typeof schema> | undefined

export function useDb() {
  if (!db) {
    // NUXT_DATABASE_URL wins; DATABASE_URL is what the Vercel ↔ Neon
    // integration injects when the store is connected to the project.
    const url = useRuntimeConfig().databaseUrl || process.env.DATABASE_URL
    if (!url) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database is not configured'
      })
    }
    db = drizzle(neon(url), { schema })
  }
  return db
}
