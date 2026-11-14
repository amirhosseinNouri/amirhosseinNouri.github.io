import type { H3Event } from 'h3'
import { clerkClient } from '@clerk/nuxt/server'
import { checkAdmin } from './adminCheck'

/**
 * Throws 401 when signed out and 403 when the signed-in user is not the
 * configured admin (verified email must match `runtimeConfig.adminEmail`).
 */
export async function requireAdmin(event: H3Event): Promise<string> {
  const { userId } = event.context.auth()
  const result = await checkAdmin({
    userId,
    adminEmail: useRuntimeConfig(event).adminEmail,
    // @clerk/nuxt ships its own copy of h3's types; the runtime event is identical.
    getUser: (id) =>
      clerkClient(event as Parameters<typeof clerkClient>[0]).users.getUser(id)
  })
  if (!result.ok) {
    throw createError({
      statusCode: result.statusCode,
      statusMessage: result.statusCode === 401 ? 'Unauthorized' : 'Forbidden'
    })
  }
  return result.userId
}
