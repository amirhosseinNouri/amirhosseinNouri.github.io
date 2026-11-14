# Amir Nouri — Personal Portfolio

Portfolio site for [Amir Nouri](https://github.com/amirhosseinnouri) (Senior Software Engineer). Shows his open-source projects, experience, and skills, plus a **Notes** section of short learning notes managed from a private admin dashboard. Built with Nuxt 4 in hybrid mode and deployed to Vercel. The old [amirhosseinnouri.github.io](https://amirhosseinnouri.github.io) URL redirects to the new origin.

## Tech stack

- **Nuxt 4** (Vue 3, hybrid rendering: home/projects prerendered, notes ISR, admin SPA)
- **Nuxt UI v4** and **Tailwind CSS v4**; `UEditor` (TipTap) for the notes editor, `@nuxtjs/mdc` to render notes
- **Neon** Postgres via **Drizzle ORM**
- **Clerk** for admin auth
- **TypeScript** (strict), **Vitest** for tests
- **Vercel** hosting; GitHub Pages serves a redirect stub

## Run locally

Requires **Node 22** (pinned in `.nvmrc` and `package.json` `engines`) and **pnpm**.

```bash
cp .env.example .env   # fill in Clerk + Neon values
pnpm install
pnpm db:migrate        # create/upgrade the notes table
pnpm dev
```

Open `http://localhost:3000`. A `pnpm postinstall` hook runs automatically on install.

### Quality gates

All gates must exit 0 before merging:

```bash
pnpm lint       # ESLint
pnpm typecheck  # vue-tsc, strict
pnpm test       # Vitest
pnpm build      # server + prerendered output in .output
```

Preview the build locally with `node .output/server/index.mjs` (env vars must be set).

## Analytics override

Google Analytics (GA4) is wired up via `nuxt-gtag`. The default measurement ID `G-8NCFLTG53R` is committed in `nuxt.config.ts`, so a plain `pnpm build` produces a working build. To attribute traffic to a different GA4 property, override at build time:

```bash
NUXT_PUBLIC_GTAG_ID=G-XXXXXXXXXX pnpm build
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

3. **Commit and push.** CI runs the gates on your PR; merging to `main` deploys to Vercel.

The data is validated by a regression spec (`app/data/projects.spec.ts`) — a duplicate slug, empty `image`, malformed link URL, or a project with no links fails `pnpm test`.

Every project in the registry also gets its own detail page at `/projects/<slug>` (e.g. `/projects/momgen`), prerendered at build time and linked from its card's image and title on the home page.

## Notes

Public pages:

- `/notes`: every published note (date + title), newest first, with tag filters (`?tag=`).
- `/notes/<slug>`: the note itself, with a table of contents, tags and highlighted code.

Both are rendered on demand and cached at the edge for 60 s (`isr: 60`), so edits show up within about a minute. `/blog` permanently redirects to `/notes`.

### Admin dashboard

`/admin` lists all notes, drafts included. From there you can create, edit, publish/unpublish and delete notes. The editor is Nuxt UI's `UEditor` and stores content as **Markdown**.

Access control:

1. **Clerk dashboard (one-time):**
   - Under _Configure → Restrictions_, set sign-up mode to **Restricted**.
   - Add the admin email to the **Allowlist**.
   - Nobody else can create an account.
2. **Server check:** every `/api/admin/*` handler calls `requireAdmin` (`server/utils/requireAdmin.ts`).
   - It returns **401** without a Clerk session.
   - It returns **403** unless one of the user's _verified_ email addresses equals `NUXT_ADMIN_EMAIL`.

### Database

The schema is in `server/db/schema.ts`. Migrations live in `server/db/migrations/`.

```bash
pnpm db:generate  # after changing the schema
pnpm db:migrate   # apply (uses DATABASE_URL_UNPOOLED)
pnpm db:studio    # browse data
```

## Deploying (Vercel)

1. Import the repo in Vercel. The framework preset is Nuxt, and the build command is `pnpm build`.
2. Connect the Neon store (`neon-copper-candle`) to the project under *Storage*. It injects `DATABASE_URL`, which the app reads when `NUXT_DATABASE_URL` is unset.
3. Push the remaining variables from your local `.env` with `pnpm env:sync` (add `--dry-run` to preview):
   - `NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `NUXT_CLERK_SECRET_KEY`
   - `NUXT_ADMIN_EMAIL`
   - `NUXT_SITE_URL`
4. In GitHub, set the repository variable `SITE_URL` to the Vercel/custom URL, then run the _Deploy GitHub Pages redirect_ workflow so old github.io links forward there.

## Project structure

- `app/data/*.ts` — typed source-of-truth data (`projects.ts`, `socials.ts`, experience and skills)
- `app/components/` — Vue components for each section
- `app/pages/` — routes (`index.vue`, `projects/[slug].vue`, `notes/`, `admin/`)
- `server/api/` — public notes API and admin CRUD API (`admin/`)
- `server/db/` — Drizzle schema and migrations
- `shared/` — types and validation shared by app and server
- `public/images/projects/` — project preview images
