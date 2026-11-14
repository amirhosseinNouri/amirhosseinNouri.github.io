import { z } from 'zod'
import { slugify } from './slug'

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const noteInputSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required').max(200),
    slug: z
      .string()
      .trim()
      .max(80)
      .regex(slugPattern, 'Use lowercase letters, numbers and dashes')
      .optional()
      .or(z.literal('')),
    description: z.string().trim().max(500).nullish(),
    content: z.string().max(200_000).default(''),
    tags: z
      .array(z.string().trim().toLowerCase().min(1).max(40))
      .max(20)
      .default([])
      .transform((tags) => [...new Set(tags)]),
    status: z.enum(['draft', 'published']).default('draft')
  })
  .transform((input) => ({
    ...input,
    slug: input.slug || slugify(input.title),
    description: input.description || null
  }))
  .refine((input) => input.slug.length > 0, {
    message: 'Could not derive a slug from the title',
    path: ['slug']
  })

export type NoteInput = z.output<typeof noteInputSchema>
