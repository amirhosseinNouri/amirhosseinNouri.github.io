/**
 * Pure admin-authorisation logic, kept free of Nuxt/Clerk imports so it can be
 * unit-tested directly. `requireAdmin` wires it to the real request.
 */

export interface EmailLike {
  emailAddress: string
  verification: { status: string } | null
}

export interface UserLike {
  emailAddresses: EmailLike[]
}

export function isAdminUser(user: UserLike, adminEmail: string): boolean {
  const target = adminEmail.trim().toLowerCase()
  if (!target) return false
  return user.emailAddresses.some(
    (e) =>
      e.emailAddress.trim().toLowerCase() === target &&
      e.verification?.status === 'verified'
  )
}

export type AdminCheckResult =
  { ok: true; userId: string } | { ok: false; statusCode: 401 | 403 }

const TTL_MS = 60_000
const cache = new Map<string, { ok: boolean; expires: number }>()

export async function checkAdmin(opts: {
  userId: string | null | undefined
  adminEmail: string
  getUser: (userId: string) => Promise<UserLike>
  now?: number
}): Promise<AdminCheckResult> {
  const { userId, adminEmail, getUser } = opts
  if (!userId) return { ok: false, statusCode: 401 }

  const now = opts.now ?? Date.now()
  const hit = cache.get(userId)
  let ok: boolean
  if (hit && hit.expires > now) {
    ok = hit.ok
  } else {
    ok = isAdminUser(await getUser(userId), adminEmail)
    cache.set(userId, { ok, expires: now + TTL_MS })
  }

  return ok ? { ok: true, userId } : { ok: false, statusCode: 403 }
}

/** Test helper. */
export function clearAdminCache() {
  cache.clear()
}
