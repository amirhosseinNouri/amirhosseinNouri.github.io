# AGENTS.md — Personal Portfolio

## Repo

- **Remote:** `git@github.com:amirhosseinNouri/amirhosseinNouri.github.io.git`
- **Live site:** https://amirhosseinNouri.github.io
- **Plan of record:** [`plan.md`](plan.md) — the source of truth this issue list was generated from. Update `plan.md` if scope changes, and keep this list in sync.
- **Milestone:** `Portfolio v1`
- **Labels:** `infra` (scaffolding, UI kit config, CI/CD, tooling) · `feature` (product work: sections, data model, SEO, polish)

## How to pick up a ticket

Every task in `plan.md` is its own atomic issue so agents can work in parallel. Before starting, check the **Dependencies** section in the issue body — an issue may be blocked by an earlier one (e.g. Phase 1 must land before Phase 2). For components, the corresponding `.spec.ts` file (component test) lives with the component and must keep passing.

Prerequisite rule: **do not start an issue whose dependency issues are still open** (with the exception of Phase 8 CI/CD, which can be drafted early but only verified after #30 lands). When you finish, close the issue and reference the PR.

## Issue list

| # | Title | Label | Dependencies |
|---|---|---|---|
| #1 | Scaffold Nuxt 4 app with pnpm and Node 22 | infra | — |
| #2 | Add Node .gitignore | infra | #1 |
| #3 | Enable strict TypeScript typechecking | infra | #1 |
| #4 | Add ESLint via @nuxt/eslint | infra | #1 |
| #5 | Add Vitest test harness with one passing test | infra | #1 |
| #6 | Add EditorConfig and Prettier (single formatter) | infra | #1 |
| #7 | Install and register Nuxt UI v4 | infra | #1 |
| #8 | Create base CSS and register styles | infra | #7 |
| #9 | Wrap root template in UApp | infra | #7 |
| #10 | Define theme in app.config.ts | infra | #7 |
| #11 | Set type scale and shared page container width | infra | #10 |
| #12 | Add dark mode toggle (system default, no flash) | infra | #10 |
| #13 | Define the Project type | feature | #7 |
| #14 | Create typed project registry seeded with momgen and voxgen | feature | #13 |
| #15 | Add project data regression spec | feature | #14 |
| #16 | Build ProjectCard component | feature | #14, #7 |
| #17 | Build ProjectsSection grid | feature | #16 |
| #18 | Capture preview images for momgen and voxgen | feature | #16 |
| #19 | Add ProjectsSection component test | feature | #17 |
| #20 | Build Hero section | feature | #7, #25 |
| #21 | Build About section | feature | #7 |
| #22 | Build Experience section and data | feature | #7 |
| #23 | Build Skills section and data | feature | #7 |
| #24 | Build SiteFooter with typed socials data | feature | #7 |
| #25 | Add resume PDF to public assets | feature | — |
| #26 | Assemble home page sections in order | feature | #17, #20, #21, #22, #23 |
| #27 | Create shared default layout | feature | #24, #28 |
| #28 | Build SiteHeader with nav and theme toggle | feature | #12 |
| #29 | Create blog placeholder page | feature | #7 |
| #30 | Verify both routes are prerendered | feature | #29 |
| #31 | Configure global head and home SEO meta | feature | #26 |
| #32 | Create site OG image | feature | #31 |
| #33 | Add sitemap and robots modules | feature | #31, #29 |
| #34 | Add favicon set and web manifest | feature | #7 |
| #35 | Add JSON-LD Person structured data | feature | #24, #26 |
| #36 | Verify SEO meta in generated HTML | feature | #31, #32 |
| #37 | Install and register nuxt-gtag | feature | #7 |
| #38 | Configure GA4 measurement ID and dev guard | feature | #37 |
| #39 | Add GA privacy note to footer | feature | #24 |
| #40 | Verify GA tracking after deploy | feature | #38, #41 |
| #41 | Add GitHub Pages deploy workflow | infra | #30 |
| #42 | Add PR CI workflow | infra | #41 |
| #43 | Configure Pages source to GitHub Actions | infra | #41 |
| #44 | Lighthouse audit and fixes | feature | #43 |
| #45 | Accessibility audit | feature | #26, #29 |
| #46 | Respect prefers-reduced-motion | feature | #26 |
| #47 | Cross-browser and device check | feature | #43 |
| #48 | Write README | feature | #14, #26 |
| #49 | Style the 404 page | feature | #26, #7 |
| #50 | Optional: blog posts via @nuxt/content | feature | #29 |
| #51 | Optional: per-project detail routes | feature | #16 |

## Parallelism notes

- **Critical path:** #1 → #7 → #13 → #14 → #16 → #17 → #26 → #31 → #32 → ... (Scaffold → UI kit → data → cards → grid → home page → SEO)
- **Parallelizable once #7 lands:** #8–#12 (theming), #13–#15 (data model), #21–#25 (content sections), #29, #34, #37
- **Phase 5/6 parallelism:** #20–#25 (content) and #28/#29 (header/blog) can proceed together once #16 lands.
- **CI/CD:** #41 can be drafted early but is only *verified* after #30 (blog route prerendered). #40 and #44/#47 require a live deploy (#43).
- **Leaf tickets** (no dependents waiting on them in practice, safe to run late/parallel): #25, #46, #48, #50, #51.

## Working conventions

- Package manager: **pnpm**, Node 22.
- Gates that must pass before a PR is mergeable: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm generate`.
- Static output ships via GitHub Pages Actions workflow; `.nojekyll` is mandatory (see #41).
- Keep the two source-of-truth data files in sync with the UI: `app/data/projects.ts` and `app/data/socials.ts`.
