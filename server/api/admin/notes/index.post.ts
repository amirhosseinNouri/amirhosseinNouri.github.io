import { noteInputSchema } from '#shared/utils/noteInput'
import { notes } from '../../../db/schema'
import { isUniqueViolation, toAdminNote } from '../../../utils/notes'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const input = await readValidatedBody(event, noteInputSchema.parse)
  try {
    const [row] = await useDb()
      .insert(notes)
      .values({
        ...input,
        publishedAt: input.status === 'published' ? new Date() : null
      })
      .returning()
    setResponseStatus(event, 201)
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
