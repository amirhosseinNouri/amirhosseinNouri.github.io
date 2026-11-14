/** Asks the server whether the signed-in user is the admin. */
export function useAdminAccess() {
  return useFetch<{ admin: boolean }>('/api/admin/me', {
    key: 'admin-me',
    server: false,
    lazy: true
  })
}
