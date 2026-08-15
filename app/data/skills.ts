export interface SkillGroup {
  category: string
  skills: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    category: 'Languages & Runtimes',
    skills: ['JavaScript', 'TypeScript', 'Go', 'Node.js']
  },
  {
    category: 'Frontend',
    skills: [
      'React',
      'Next.js',
      'Redux',
      'React Query',
      'Zustand',
      'Zod',
      'Tailwind CSS',
      'Shadcn UI',
      'Framer Motion',
      'Vite',
      'React Router v6',
      'Storybook',
      'TanStack Router'
    ]
  },
  {
    category: 'Architecture',
    skills: ['Microfrontend', 'SSR', 'NX', 'Turborepo', 'Microservices']
  },
  {
    category: 'APIs & Real-Time',
    skills: ['GraphQL', 'WebSocket', 'MQTT', 'WebRTC']
  },
  {
    category: 'Testing',
    skills: ['Jest', 'Vitest', 'Playwright', 'React Testing Library', 'TDD']
  },
  {
    category: 'DevOps & Cloud',
    skills: [
      'Docker',
      'Kubernetes',
      'Helm',
      'CI/CD',
      'GitLab CI',
      'CircleCI',
      'Argo CD',
      'Google Cloud',
      'Linux',
      'Grafana'
    ]
  }
]
