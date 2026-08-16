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

export const projectsBase = '/projects'

export function projectRoute(slug: string) {
  return `${projectsBase}/${slug}`
}

export function isExternal(href: string) {
  return href.startsWith('http')
}

export type ProjectLinkButtonProps = {
  icon: string
  color: 'primary' | 'neutral'
  variant: 'solid' | 'outline' | 'ghost'
  external: boolean
  target: '_blank' | undefined
  rel: 'noopener noreferrer' | undefined
}

export function getProjectLinkProps(link: ProjectLink): ProjectLinkButtonProps {
  const external = isExternal(link.href)
  return {
    icon: linkIcons[link.type],
    color: link.type === 'demo' ? 'primary' : 'neutral',
    variant: linkVariants[link.type],
    external,
    target: external ? '_blank' : undefined,
    rel: external ? 'noopener noreferrer' : undefined
  }
}
