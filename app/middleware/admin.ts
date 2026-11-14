/**
 * Client-side gate for /admin pages (they are SPA-rendered). The real
 * enforcement lives in `server/utils/requireAdmin.ts`; this only avoids
 * flashing the dashboard to signed-out visitors.
 */
export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded.value) {
    await new Promise<void>((resolve) => {
      const stop = watch(isLoaded, (loaded) => {
        if (loaded) {
          stop()
          resolve()
        }
      })
    })
  }

  if (!isSignedIn.value) {
    return navigateTo('/admin/sign-in')
  }
})
