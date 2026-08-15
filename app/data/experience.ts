export interface ExperienceRole {
  title: string
  /** Start month, format `MM/YYYY` (e.g. `03/2025`). */
  start: string
  /** End month, format `MM/YYYY`; use `'Present'` when the role is ongoing. */
  end: string
  context?: string
}

export interface Experience {
  company: string
  context?: string
  roles: ExperienceRole[]
}

export const experiences: Experience[] = [
  {
    company: 'Snapp',
    context: 'The leading ride-hailing platform in the Middle East, serving 50M+ users.',
    roles: [
      {
        title: 'Frontend Tech Lead',
        start: '03/2025',
        end: 'Present',
        context:
          'Lead 7 engineers across 5 product areas and migrated the 500+ page passenger app to SSR Next.js 15.'
      },
      {
        title: 'Senior Frontend Developer',
        start: '05/2024',
        end: '03/2025',
        context:
          'Built a GitLab CI AI agent and a TypeScript utility package now used by 30+ developers.'
      },
      {
        title: 'Frontend Developer',
        start: '06/2021',
        end: '05/2024',
        context:
          'Architected Snapp\u2019s UI Kit and its 100K+ LOC passenger web application.'
      },
      {
        title: 'Frontend Intern',
        start: '03/2021',
        end: '06/2021',
        context:
          'Built an internal data dashboard with React, Redux, and REST APIs that replaced manual workflows.'
      }
    ]
  },
  {
    company: 'Vport',
    context:
      'Early-stage startup building an immersive VR platform for live music streaming in 4K 360-degree video.',
    roles: [
      {
        title: 'Senior Software Engineer (Part-Time Contract)',
        start: '06/2024',
        end: '12/2025',
        context:
          'Cut support costs ~62% and video buffering 40% with a custom Chatwoot/Go support system and HLS streaming.'
      }
    ]
  }
]
