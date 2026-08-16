import type { ProjectLink } from '~/types/project'

export const linkIcons: Record<ProjectLink['type'], string> = {
  repo: 'i-simple-icons-github',
  demo: 'i-lucide-external-link',
  package: 'i-lucide-package'
}

export const linkVariants: Record<
  ProjectLink['type'],
  'solid' | 'outline' | 'ghost'
> = {
  repo: 'outline',
  demo: 'solid',
  package: 'ghost'
}

export function isExternal(href: string) {
  return href.startsWith('http')
}
