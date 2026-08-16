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

Merged from the original 51 atomic tickets — tickets that shipped the same deliverable (a component and its spec, a step and its verification, or tooling that edits the same files) were consolidated. Closed superseded tickets are listed after the open ones.

### Open

All required tickets are closed and the site is live. Only the two optional follow-ups remain open:

| # | Title | Label | Dependencies |
|---|---|---|---|
| #50 | Optional: blog posts via @nuxt/content | feature | #29 |

#51 (per-project detail routes) was implemented and closed in PR #85.

### Closed (merged into a ticket above)

| # | Title | Merged into |
|---|---|---|
| #2 | Add Node .gitignore | #1 |
| #4 | Enable strict TypeScript typechecking | #3 |
| #5 | Add Vitest test harness with one passing test | #3 |
| #6 | Add EditorConfig and Prettier (single formatter) | #3 |
| #9 | Wrap root template in UApp | #8 |
| #11 | Set type scale and shared page container width | #10 |
| #14 | Create typed project registry seeded with momgen and voxgen | #13 |
| #15 | Add project data regression spec | #13 |
| #19 | Add ProjectsSection component test | #17 |
| #25 | Add resume PDF to public assets | #20 |
| #28 | Build SiteHeader with nav and theme toggle | #27 |
| #30 | Verify both routes are prerendered | #29 |
| #36 | Verify SEO meta in generated HTML | #31 |
| #42 | Add PR CI workflow | #41 |
| #43 | Configure Pages source to GitHub Actions | #41 |
| #46 | Respect prefers-reduced-motion | #45 |

### Closed (shipped as part of their PR)

| # | Title | PR |
|---|---|---|
| #40 | Verify GA tracking after deploy | #84 (verification only) |
| #44 | Lighthouse audit and fixes | #84 |
| #45 | Accessibility audit incl. prefers-reduced-motion | #83 |
| #47 | Cross-browser and device check | verification only |
| #48 | Write README | #81 |
| #51 | Optional: per-project detail routes | #85 |

## Parallelism notes

- **Critical path:** #1 → #7 → #13 → #16 → #17 → #26 → #31 → #32 → ... (Scaffold → UI kit → data → cards → grid → home page → SEO)
- **Parallelizable once #7 lands:** #8, #10, #12 (theming), #13 (data model), #21–#24 (content sections), #29, #34, #37
- **Phase 5/6 parallelism:** #20–#24 (content) and #27/#29 (header/blog) can proceed together once #16 lands.
- **CI/CD:** #41 can be drafted early but is only *verified* after #29 (blog route prerendered). #40 and #44/#47 require a live deploy (#41).
- **Leaf tickets** (no dependents waiting on them in practice, safe to run late/parallel): #32, #39, #48, #50, #51.

## Working conventions

- Package manager: **pnpm**, Node 22.
- Gates that must pass before a PR is mergeable: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm generate`.
- Static output ships via GitHub Pages Actions workflow; `.nojekyll` is mandatory (see #41).
- Keep the two source-of-truth data files in sync with the UI: `app/data/projects.ts` and `app/data/socials.ts`.
