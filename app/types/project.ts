export type ProjectLink = {
  label: string
  href: string
  type: 'repo' | 'demo' | 'package'
}

export type Project = {
  slug: string
  name: string
  description: string
  image: string
  imageAlt: string
  tags: string[]
  links: ProjectLink[]
  featured?: boolean
}
