# Amir Nouri — Personal Portfolio

Static portfolio site for [Amir Nouri](https://github.com/amirhosseinnouri) (Senior Software Engineer). Shows his open-source projects, experience, and skills, plus a blog placeholder for future writeups. Built as a statically generated Nuxt 4 site and deployed to GitHub Pages at [amirhosseinnouri.github.io](https://amirhosseinnouri.github.io).

## Tech stack

- **Nuxt 4** (Vue 3, full static prerender via `nuxt generate`)
- **Nuxt UI v4** and **Tailwind CSS v4**
- **TypeScript** (strict), **Vitest** for tests
- **GitHub Pages** via GitHub Actions

## Run locally

Requires **Node 22** (pinned in `.nvmrc` and `package.json` `engines`) and **pnpm**.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. A `pnpm postinstall` hook runs automatically on install.

### Quality gates

All gates must exit 0 before merging:

```bash
pnpm lint       # ESLint
pnpm typecheck  # vue-tsc, strict
pnpm test       # Vitest
pnpm generate   # static output in .output/public
```

Preview the built output locally with `npx serve .output/public`.

## Analytics override

Google Analytics (GA4) is wired up via `nuxt-gtag`. The default measurement ID `G-8NCFLTG53R` is committed in `nuxt.config.ts`, so a plain `pnpm generate` produces a working build. To attribute traffic to a different GA4 property, override at build time:

```bash
NUXT_PUBLIC_GTAG_ID=G-XXXXXXXXXX pnpm generate
```

Tracking is disabled outside production builds.

## Adding a project

Adding a project is a three-step flow:

1. **Append an entry to `app/data/projects.ts`.** The `Project` shape is:

   ```ts
   {
     slug: 'my-project',                            // unique, used as list key
     name: 'My Project',
     description: 'One or two sentences for the card body.',
     image: '/images/projects/my-project.png',      // path under public/
     imageAlt: 'Preview of the My Project app',
     tags: ['TypeScript', 'Next.js'],               // tech chips
     featured: true,                                // optional; reserved for future use (grid order follows array order)
     links: [
       { label: 'GitHub', href: 'https://github.com/...', type: 'repo' },
       { label: 'Live demo', href: 'https://...', type: 'demo' },
       { label: 'npm', href: 'https://www.npmjs.com/...', type: 'package' }
     ]
   }
   ```

   `type` is one of `'repo' | 'demo' | 'package'`. A project must have **at least one** link — only the ones you list are rendered.

2. **Drop the preview image in `public/images/projects/`** as `<slug>.png`. Capture at **1280×800** (matching aspect ratio across all projects) and compress to under ~200 KB.

3. **Commit and push.** CI runs the gates on your PR; merging to `main` triggers the deploy workflow that publishes to GitHub Pages.

The data is validated by a regression spec (`app/data/projects.spec.ts`) — a duplicate slug, empty `image`, malformed link URL, or a project with no links fails `pnpm test`.

## Project structure

- `app/data/*.ts` — typed source-of-truth data (`projects.ts`, `socials.ts`, experience and skills)
- `app/components/` — Vue components for each section
- `app/pages/` — routes (`index.vue`, `blog.vue`)
- `public/images/projects/` — project preview images
