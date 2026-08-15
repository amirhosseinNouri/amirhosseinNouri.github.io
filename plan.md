# Personal Portfolio — Implementation Plan

## Context

Amir Nouri (Senior Software Engineer, 5+ yrs, Snapp / Vport) needs a personal portfolio site. The directory `/Users/snapp/personal-projects/portfolio` is currently empty — this is a greenfield build.

The goal is a **minimal site whose primary job is showing projects** — one long home page, plus a placeholder `/blog` route for future writeups. The existing resume (`~/personal-projects/resume/v2`) is LaTeX and contains no projects section, so all project content is new and lives in the portfolio repo.

Outcome: a statically generated Nuxt site deployed to GitHub Pages at `https://amirhosseinnouri.github.io`, with a typed project registry that is trivial to extend as new projects ship.

### Decisions already made

| Decision | Choice |
|---|---|
| Framework | Nuxt 4, Vue 3 Composition API, TypeScript |
| Component library | Nuxt UI v4 (Tailwind CSS v4 underneath) |
| Rendering | `nuxt generate` (full prerender / SSG) — **not** runtime SSR |
| Hosting | GitHub Pages via GitHub Actions, repo `amirhosseinnouri.github.io` (served at root, so **no `app.baseURL` needed**) |
| Structure | Single-page home (`/`) plus a `/blog` route showing a "Coming soon" placeholder |
| Project data | Typed TS constant in the repo |
| Package manager | pnpm, Node 22 |
| CI gates | ESLint + `vue-tsc` typecheck + Vitest |
| Design | Minimal, card-based, each project card carries a preview image |
| Extras in scope | Dark mode toggle, resume PDF download, SEO + OG image, Google Analytics, social links (LinkedIn, X, Telegram `Amirhossein_nr`), blog placeholder page |
| Not in scope | Contact form, actual blog posts / CMS, per-project detail routes, custom domain |

### Important constraint

GitHub Pages serves static files only — there is no Node runtime. "SSR" is satisfied by prerendering every route at build time via `nuxt generate`; the HTML shipped to crawlers is fully populated. Additionally, GitHub Pages runs Jekyll by default, which **strips directories beginning with an underscore** — Nuxt emits its assets into `_nuxt/`, so a `.nojekyll` file in the output is mandatory or the entire site loads unstyled with no JS.

### Page section order

Home (`/`): Hero → **Projects** → About → Experience → Skills → Footer/contact.

Projects sit immediately below the hero so the stated focus is preserved even though the resume sections are included.

A second route `/blog` renders a "Coming soon" placeholder, reachable from a header nav link. Because the site is multi-route, a shared layout (header + footer) is used rather than putting the header inside the home page component.

---

## Phase 1 — Project scaffold and tooling

**Goal:** A running Nuxt app with strict TypeScript, linting, and testing wired up. No visual work yet.

Tasks:
1. Initialize a Nuxt 4 app in the repo root (`pnpm dlx nuxi@latest init .`). Set `packageManager` in `package.json`; add `.nvmrc` / `engines` pinning Node 22.
2. `git init`, add a Node `.gitignore` (`node_modules`, `.nuxt`, `.output`, `dist`, `.env`).
3. Enable strict typing: `typescript.strict: true` and `typescript.typeCheck: true` in `nuxt.config.ts`; add a `typecheck` script running `nuxt typecheck` (`vue-tsc` under the hood).
4. Add ESLint via `@nuxt/eslint` module, with a `lint` script.
5. Add Vitest via `@nuxt/test-utils` + `vitest` + `happy-dom`; add a `test` script and one trivial passing test to prove the harness works.
6. Add `.editorconfig` and Prettier (or rely on ESLint stylistic rules — pick one, do not run both formatters).

**Acceptance:** `pnpm dev` serves a page; `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm generate` all exit 0.

**Files:** `nuxt.config.ts`, `package.json`, `tsconfig.json`, `eslint.config.mjs`, `vitest.config.ts`, `.gitignore`, `.nvmrc`

---

## Phase 2 — Nuxt UI, theming, and dark mode

**Goal:** Design system in place so every later section is built from consistent primitives.

Tasks:
1. Install `@nuxt/ui` and `tailwindcss`; add `'@nuxt/ui'` to `modules` in `nuxt.config.ts`.
2. Create `app/assets/css/main.css` containing `@import "tailwindcss";` then `@import "@nuxt/ui";`, and register it via `css: ['~/assets/css/main.css']`.
3. Wrap the root template in `<UApp>` inside `app.vue` — several Nuxt UI features (toasts, tooltips, overlays) are inert without it.
4. Define the theme in `app.config.ts`: a single accent/primary color plus a neutral scale. Keep the palette to one accent — minimal is the brief.
5. Set the type scale and page container width once (a shared `<UContainer>` or a layout wrapper), so no section re-invents its own max-width.
6. Dark mode: `@nuxtjs/color-mode` ships with Nuxt UI. Add a header toggle button using `useColorMode()`. Default to `system` preference. Confirm no flash-of-wrong-theme in the generated static build.

**Acceptance:** A blank themed page renders; toggling dark/light switches the whole page and the choice survives reload; a hard refresh in dark mode shows no white flash.

**Files:** `nuxt.config.ts`, `app/app.vue`, `app/app.config.ts`, `app/assets/css/main.css`, `app/components/ColorModeToggle.vue`

---

## Phase 3 — Project data model

**Goal:** One typed source of truth for projects, validated, so adding a project later is a single object literal.

Tasks:
1. Define the `Project` type in `app/types/project.ts`:
   - `slug: string` (stable, used as list key)
   - `name: string`
   - `description: string` — one or two sentences, the card body
   - `image: string` — path to the preview image under `public/`
   - `imageAlt: string`
   - `tags: string[]` — tech chips (e.g. `TypeScript`, `Bun`, `Next.js`)
   - `links: ProjectLink[]` where `ProjectLink = { label: string; href: string; type: 'repo' | 'demo' | 'package' }`
   - `featured?: boolean`
   - Ordering field (`order?: number`) or rely on array order — pick array order for simplicity.
2. **Not every project has a live demo.** Links must be a list, not fixed `repoUrl`/`demoUrl` fields, so a project with only a repo renders exactly one button and nothing empty.
3. Create `app/data/projects.ts` exporting `export const projects: Project[]`. Seed with the two real projects:

   **momgen** — `https://github.com/amirhosseinNouri/momgen`
   Turns meeting recordings (MP3/MP4) into structured Minutes-of-Meeting markdown. Transcribes with ElevenLabs Scribe, summarizes with an LLM, strips silence and caches segments to cut transcription cost, and estimates cost before running.
   Tags: TypeScript, Bun, AI SDK, FFmpeg, CLI, Next.js
   Links: repo (GitHub), demo (`https://momgen-ai.vercel.app`), package (`@amirhosseinnouri/momgen`)

   **voxgen** — `https://github.com/amirhosseinNouri/voxgen`
   Turns a text or Markdown file into a narrated audio file using Fish Audio TTS. Normalizes Markdown for natural narration, chunks text on sentence/paragraph boundaries, caches requests, runs up to 4 calls in parallel, and outputs WAV/MP3/Opus/FLAC/M4A.
   Tags: TypeScript, Bun, TTS, FFmpeg, CLI, Next.js
   Links: repo (GitHub), demo (`https://voxgen-cli.vercel.app`), package (`@amirhosseinnouri/voxgen`)

4. Add a Vitest spec `app/data/projects.spec.ts` asserting: slugs are unique and non-empty; every project has at least one link; every `image` path is non-empty and starts with `/`; every link `href` parses as a valid URL. This is the regression net that catches a malformed entry when a project is added months from now.

**Acceptance:** `pnpm test` passes; adding a duplicate slug makes it fail.

**Files:** `app/types/project.ts`, `app/data/projects.ts`, `app/data/projects.spec.ts`

---

## Phase 4 — Projects section (the centerpiece)

**Goal:** The projects grid, rendered directly under the hero.

Tasks:
1. `ProjectCard.vue` — props: a single `Project`. Renders preview image (top), name, description, tag chips (`UBadge`), and one button per link (`UButton`, external links get `target="_blank" rel="noopener noreferrer"`). Built on `UCard` or a plain styled container — whichever gives cleaner control over the image bleed.
2. Image handling: use `@nuxt/image` with a static provider, or plain `<img>` with explicit `width`/`height` and `loading="lazy"` on all but the first card. Explicit dimensions are required — without them the grid reflows as images load and CLS suffers.
3. `ProjectsSection.vue` — section heading plus a responsive grid: 1 column on mobile, 2 from `md` up. Iterates `projects` keyed by `slug`.
4. Handle the no-demo case explicitly: a project with only a repo link must render one button, correctly labeled, with no gap or placeholder.
5. Preview images: capture screenshots of the two live demo sites and save them to `public/images/projects/`.
   - `https://momgen-ai.vercel.app/` → `public/images/projects/momgen.png`
   - `https://voxgen-cli.vercel.app/` → `public/images/projects/voxgen.png`

   Capture both at the **same** viewport (1280×800 recommended, `deviceScaleFactor: 2` for retina sharpness) so aspect ratios match — mismatched ratios are what make a minimal grid look broken. Use a headless capture (Playwright `page.screenshot()`, or the browser's own device-toolbar capture). Capture the top of the page, not a full-page scroll, so the card thumbnail shows the hero rather than a compressed strip of the whole site. Compress to under ~200 KB each (`pngquant`, `sharp`, or export as WebP).
6. Component test: render `ProjectsSection` and assert one card per entry in `projects`, and that a project with a single link renders a single link.

**Acceptance:** Grid renders both projects with images at mobile, tablet, and desktop widths; no horizontal scroll; no layout shift on load.

**Files:** `app/components/ProjectCard.vue`, `app/components/ProjectsSection.vue`, `public/images/projects/*`, matching `.spec.ts`

---

## Phase 5 — Hero, About, Experience, Skills, Footer

**Goal:** Remaining content, all sourced from the resume, all subordinate to the projects section.

Content source: `~/personal-projects/resume/v2/sections/*.tex`.

Tasks:
1. **Hero** (`HeroSection.vue`): name "Amir Nouri", title **"Senior Software Engineer"**, location Istanbul, Turkey, and a one-line positioning statement, plus the resume PDF download button. Suggested one-liner, condensed from `summary.tex`: *"Building and scaling web products for 50M+ users — React, Next.js, and TypeScript at Snapp."* The site header (nav + color-mode toggle) is built in Phase 6 as part of the shared layout, not inside the hero.
2. **About** (`AboutSection.vue`): 2–3 sentences adapted from `summary.tex` — 5+ years, products serving 50M+ users, SSR migrations, design systems, frontend platform work.
3. **Experience** (`ExperienceSection.vue`): compact, from `experience.tex`. Snapp (Frontend Tech Lead 03/2025–Present; Senior Frontend Developer 05/2024–03/2025; Frontend Developer 06/2021–05/2024; Frontend Intern 03/2021–06/2021) and Vport (Senior Software Engineer, part-time contract, 06/2024–12/2025). Company name, role, dates, and at most one line of context each — do **not** port the full resume bullet lists, which would bury the projects.
4. **Skills** (`SkillsSection.vue`): grouped chips from `skills.tex` (Languages & Runtimes / Frontend / Architecture / APIs & Real-Time / Testing / DevOps & Cloud). Same `UBadge` primitive as project tags for visual consistency.
5. **Footer / contact** (`SiteFooter.vue`): social links, no contact form. Store them in `app/data/socials.ts` as a typed array so the footer and the JSON-LD `sameAs` block in Phase 7 share one source:
   - LinkedIn — `https://linkedin.com/in/amirhosseinnouri2000`
   - GitHub — `https://github.com/amirhosseinnouri`
   - X — `https://x.com/amirhosein_nr`
   - Telegram — `https://t.me/Amirhossein_nr`
   - Email — `mailto:amir.h.nouri2000@gmail.com`

   Note the X handle (`amirhosein_nr`) and the Telegram handle (`Amirhossein_nr`) differ in spelling and case — copy each verbatim, do not normalize them to match.
6. Resume PDF: copy `~/personal-projects/resume/v2/Amir_Nouri_Senior_Software_Engineer_Resume.pdf` into `public/Amir_Nouri_Resume.pdf` and link it with a `download` attribute.
7. Assemble all sections in order in `app/pages/index.vue`: Hero → Projects → About → Experience → Skills.

**Acceptance:** Full page scrolls cleanly in both themes at 375px, 768px, and 1440px; resume PDF downloads; every social link opens the right destination.

**Files:** `app/pages/index.vue`, `app/components/{Hero,About,Experience,Skills}Section.vue`, `app/components/SiteFooter.vue`, `app/data/{experience,skills}.ts`, `public/Amir_Nouri_Resume.pdf`

---

## Phase 6 — Shared layout, navigation, and blog placeholder

**Goal:** Introduce the second route and the chrome shared by both pages, without building a real blog.

The site is not single-page, so header and footer move out of `index.vue` into a layout that both routes use.

Tasks:
1. Create `app/layouts/default.vue` containing `<SiteHeader />`, `<slot />`, and `<SiteFooter />`. Move `SiteFooter` usage here and out of `index.vue`.
2. Create `app/components/SiteHeader.vue`: name or monogram on the left; on the right, nav links (`Home`, `Blog`) plus the color-mode toggle from Phase 2. Use `<NuxtLink>` so client-side navigation works and the active route is styled. Keep it sparse — a bar with three items, no dropdowns.
3. Create `app/pages/blog.vue`: a centered "Coming soon" state — short heading, one sentence explaining that writeups are on the way, and a link back home. Use a Nuxt UI empty/placeholder-style layout rather than inventing new markup.
4. Give `/blog` its own `useSeoMeta()` title and description so the tab and any shared link are not labeled with the home page's metadata.
5. Confirm `nuxt generate` prerenders **both** `/` and `/blog` — verify `.output/public/blog/index.html` exists. On GitHub Pages a route that is not prerendered 404s on direct navigation and hard refresh, even though in-app navigation appears to work.
6. Structure the blog page so a future post list can replace the placeholder body without touching the layout or header — the eventual approach is `@nuxt/content` with `content/blog/*.md` and a `/blog/[slug]` route, but none of that is built now.

**Acceptance:** Header nav navigates between `/` and `/blog`; the active link is visibly marked; loading `https://<site>/blog` directly (not via in-app nav) serves the page; the color-mode toggle works on both routes.

**Files:** `app/layouts/default.vue`, `app/components/SiteHeader.vue`, `app/pages/blog.vue`

---

## Phase 7 — SEO, Open Graph, metadata, and analytics

**Goal:** Sharing the link produces a correct title, description, and preview image; traffic is measurable.

Tasks:
1. Set global head config in `nuxt.config.ts` (`app.head`) plus `useSeoMeta()` on the index page: title, description, canonical `https://amirhosseinnouri.github.io`, `og:title`, `og:description`, `og:image`, `og:url`, `og:type=website`, `twitter:card=summary_large_image`.
2. Create one static OG image (1200×630) at `public/og.png`. A single site-wide image is sufficient — there are no per-project routes.
3. Add `@nuxtjs/sitemap` and `@nuxtjs/robots`. Both routes (`/` and `/blog`) must appear in the sitemap.
4. Add a favicon set and `public/site.webmanifest`.
5. Add JSON-LD `Person` structured data via `useHead({ script: [...] })` — name "Amir Nouri", `jobTitle` "Senior Software Engineer", URL, and a `sameAs` array built from `app/data/socials.ts` (Phase 5) rather than a second hardcoded list.
6. Verify the **generated** HTML in `.output/public/index.html` actually contains the meta tags and section text — meta added only client-side would defeat the purpose.

### Google Analytics

7. Install the `nuxt-gtag` module and register it in `nuxt.config.ts`. It is built for Nuxt, injects the GA4 script correctly on a static build, and exposes `useTrackEvent()` for custom events.
8. Measurement ID: **`G-8NCFLTG53R`**. Configure it as `gtag: { id: process.env.NUXT_PUBLIC_GTAG_ID || 'G-8NCFLTG53R' }` — the literal is the committed default so a plain `pnpm generate` produces a working build, and the environment variable stays available as an override. A GA4 measurement ID is public by design (it ships in the page source), so committing it is not a secret leak and no GitHub secret is required.
9. Guard against analytics running in development: enable the module only when `process.env.NODE_ENV === 'production'`, or set `enabled: false` in dev, so local page loads do not pollute the report.
10. Verify tracking works after deploy: load the live site and confirm the request to `google-analytics.com/g/collect` fires, then check GA4 Realtime for the session. Also confirm a client-side navigation from `/` to `/blog` records a second page view — SPA route changes are the classic case where GA silently under-reports.
11. Privacy: GA4 sets cookies. Add a one-line privacy note in the footer stating that anonymous analytics are collected. A full consent banner is out of scope for a personal site, but note that this is the piece an EU-facing site would need.

**Acceptance:** `grep` the generated `index.html` for `og:image` and project names and find them; OG preview renders correctly in a card validator; GA4 Realtime shows a live session and counts `/` and `/blog` as separate page views.

**Files:** `nuxt.config.ts`, `app/pages/index.vue`, `app/pages/blog.vue`, `public/og.png`, `public/favicon.*`

---

## Phase 8 — GitHub Actions CI/CD to GitHub Pages

**Goal:** Push to `main` publishes the site.

Tasks:
1. Create the GitHub repo named exactly `amirhosseinnouri.github.io` (this exact name is what serves the site at the domain root and removes any need for `app.baseURL`).
2. `.github/workflows/deploy.yml`, triggered on push to `main` and on `workflow_dispatch`:
   - `actions/checkout@v4`
   - `pnpm/action-setup@v4`
   - `actions/setup-node@v4` with Node 22 and `cache: 'pnpm'`
   - `pnpm install --frozen-lockfile`
   - `pnpm lint` → `pnpm typecheck` → `pnpm test` (fail the deploy on any failure)
   - `pnpm generate` — the GA measurement ID (`G-8NCFLTG53R`) is committed as the default in `nuxt.config.ts`, so no environment variable or repository secret is needed in the workflow
   - **`touch .output/public/.nojekyll`** — without this, GitHub Pages' Jekyll strips the `_nuxt/` asset directory and the site loads with no CSS or JS
   - `actions/configure-pages@v5`, `actions/upload-pages-artifact@v3` (path `.output/public`), `actions/deploy-pages@v4`
   - Permissions block: `contents: read`, `pages: write`, `id-token: write`; `concurrency` group `pages` with `cancel-in-progress: false`
3. Add a PR workflow (`.github/workflows/ci.yml`) running lint + typecheck + test + build on pull requests, without deploying.
4. In repo settings, set Pages source to **GitHub Actions** (not "deploy from branch").

**Acceptance:** A push to `main` produces a green run; `https://amirhosseinnouri.github.io` serves the styled site with working JS; `https://amirhosseinnouri.github.io/blog` loads on direct navigation. A deliberately broken type makes CI fail before deploying.

**Files:** `.github/workflows/deploy.yml`, `.github/workflows/ci.yml`

---

## Phase 9 — Polish and verification

**Goal:** Ship-quality pass on the live site.

Tasks:
1. Lighthouse on the deployed URL — target 95+ across Performance, Accessibility, Best Practices, SEO. Fix whatever falls short (most likely image sizing or color contrast).
2. Accessibility audit: single `h1`, sensible heading order, visible focus rings, meaningful `alt` on every project image, ≥4.5:1 contrast in **both** themes, keyboard-navigable through all links and the theme toggle.
3. Reduced-motion: respect `prefers-reduced-motion` for any hover or scroll animation.
4. Cross-browser and device check: Chrome, Safari, Firefox; real mobile viewport.
5. `README.md`: what the site is, how to run locally, the optional `NUXT_PUBLIC_GTAG_ID` override, and — most importantly — **how to add a new project** (append an object to `app/data/projects.ts`, drop an image in `public/images/projects/`, push).
6. Style the 404 page (`app/error.vue`) so a mistyped URL still looks like the site.
7. Optional follow-ups, not required to ship: real blog posts via `@nuxt/content` replacing the `/blog` placeholder, per-project detail routes if projects gain long-form writeups.

**Acceptance:** Lighthouse targets met on the live URL for both `/` and `/blog`; keyboard-only navigation reaches every interactive element.

---

## Verification (end to end)

```bash
pnpm install
pnpm lint          # ESLint clean
pnpm typecheck     # vue-tsc clean
pnpm test          # Vitest — project data + component specs pass
pnpm dev           # manual check at 375 / 768 / 1440 px, light and dark
pnpm generate      # static output in .output/public
npx serve .output/public   # verify the built artifact, not just dev mode
```

Then confirm in the generated output:
- `.output/public/.nojekyll` exists
- `.output/public/index.html` contains project names and `og:image` in the raw HTML
- `.output/public/blog/index.html` exists (proves `/blog` was prerendered)
- `.output/public/_nuxt/` contains the JS/CSS bundles

Post-deploy: load `https://amirhosseinnouri.github.io`, confirm styling loads (proves `.nojekyll` worked), navigate to `/blog` via the nav and again by direct URL, toggle dark mode, download the resume PDF, click through every project and social link, and confirm the session appears in GA4 Realtime with both routes counted.

---

## Resolved inputs

All previously open questions are answered; nothing blocks implementation.

| Item | Value |
|---|---|
| X (Twitter) | `https://x.com/amirhosein_nr` |
| Telegram | `https://t.me/Amirhossein_nr` |
| Hero title | Senior Software Engineer |
| Preview images | Captured from `https://momgen-ai.vercel.app/` and `https://voxgen-cli.vercel.app/` in Phase 4 |
| Resume PDF | `~/personal-projects/resume/v2/Amir_Nouri_Senior_Software_Engineer_Resume.pdf` → `public/Amir_Nouri_Resume.pdf` |
| GA4 measurement ID | `G-8NCFLTG53R` |

The only asset that must still be produced by hand is the OG image (`public/og.png`, 1200×630) in Phase 7.

## Notes for issue conversion

Each phase maps to one GitHub issue (or a milestone with the numbered tasks as sub-issues). Dependency order is largely sequential: Phase 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9.

Parallelism: Phases 5 and 6 can proceed together once Phase 4 lands. Phase 8 (CI/CD) can be drafted early but cannot be verified until Phase 6 exists, since one of its acceptance criteria is that `/blog` resolves on direct navigation.
