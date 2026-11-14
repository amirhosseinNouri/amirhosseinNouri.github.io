import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  checkAdmin,
  clearAdminCache,
  isAdminUser,
  type UserLike
} from './adminCheck'

const ADMIN = 'amir.h.nouri2000@gmail.com'

const user = (email: string, status = 'verified'): UserLike => ({
  emailAddresses: [{ emailAddress: email, verification: { status } }]
})

describe('isAdminUser', () => {
  it('accepts the verified admin email, case-insensitively', () => {
    expect(isAdminUser(user('Amir.H.Nouri2000@gmail.com'), ADMIN)).toBe(true)
  })

  it('rejects other emails', () => {
    expect(isAdminUser(user('someone@example.com'), ADMIN)).toBe(false)
  })

  it('rejects the admin email when unverified', () => {
    expect(isAdminUser(user(ADMIN, 'unverified'), ADMIN)).toBe(false)
  })

  it('rejects everyone when no admin email is configured', () => {
    expect(isAdminUser(user(ADMIN), '')).toBe(false)
  })
})

describe('checkAdmin', () => {
  beforeEach(() => clearAdminCache())

  it('returns 401 without a user id', async () => {
    const getUser = vi.fn()
    expect(
      await checkAdmin({ userId: null, adminEmail: ADMIN, getUser })
    ).toEqual({
      ok: false,
      statusCode: 401
    })
    expect(getUser).not.toHaveBeenCalled()
  })

  it('returns 403 for a non-admin user', async () => {
    const getUser = vi.fn().mockResolvedValue(user('x@example.com'))
    expect(
      await checkAdmin({ userId: 'u1', adminEmail: ADMIN, getUser })
    ).toEqual({
      ok: false,
      statusCode: 403
    })
  })

  it('passes for the admin and caches the lookup', async () => {
    const getUser = vi.fn().mockResolvedValue(user(ADMIN))
    const opts = { userId: 'u2', adminEmail: ADMIN, getUser, now: 0 }
    expect(await checkAdmin(opts)).toEqual({ ok: true, userId: 'u2' })
    await checkAdmin({ ...opts, now: 1000 })
    expect(getUser).toHaveBeenCalledTimes(1)
    await checkAdmin({ ...opts, now: 120_000 })
    expect(getUser).toHaveBeenCalledTimes(2)
  })
})
