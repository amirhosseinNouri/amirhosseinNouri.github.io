export default defineEventHandler(async (event) => {
  const userId = await requireAdmin(event)
  return { userId, admin: true }
})
