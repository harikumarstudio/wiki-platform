# AGENTS.md — Working on the Doka Platform

Instructions for AI agents: Codex, Cursor, Copilot, and Gemini CLI read this file directly; Claude Code reads it through `CLAUDE.md`, which links here. This file contains only what you need to get started without breaking things. For build details, see [`docs/how-its-work.md`](docs/how-its-work.md).

---

## 1. Working rules

These rules favor caution over speed. Use common sense for small tasks.

### Think before you write

- State your assumptions. If you're unsure, ask.
- If a task has two possible interpretations, explain both instead of choosing silently.
- If there's a simpler solution, say so. It's okay to disagree.
- If something is unclear, stop and identify exactly what is unclear.

### Keep the code minimal

- Do no more than requested.
- Don't add abstractions for a single call.
- Don't add flexibility or configurability that wasn't requested.
- Don't add error handling for impossible situations.
- If 50 lines would do instead of 200, rewrite it.

Check: would an experienced developer consider this overengineered? If so, simplify it.

### Make surgical changes

- Don't "improve" neighboring code, comments, or formatting along the way.
- Don't refactor code that isn't broken.
- Follow the existing style, even if you'd write it differently.
- If you notice unrelated dead code, mention it but don't remove it.
- Only clean up things orphaned by your own changes.

Check: every changed line should be traceable to the user's request.

### Make the goal verifiable

Phrase the task so the result can be checked with a command:

- "Add validation" → "write a test for invalid input, then make it pass."
- "Fix a bug" → "write a test that reproduces it, then make it pass."
- "Refactor X" → "make sure the tests pass before and after."

For multi-step tasks, first write a short plan: step → how to verify it.

### Tests are required

They are not optional and should not be deferred.

- **Bug fix:** first write a test that reproduces the bug. It must fail before the fix and pass afterward. If it passes before the fix, you're not fixing the right problem.
- **New functionality:** include a test for it in the same pull request.
- **A change without a test is not done.** Don't defer the test or offer to write it later.

If there is no testable unit, create one: extract the logic from the template or handler into a pure function and test it. If that's impossible (Nunjucks templates, CSS, or layout), say so and describe how you checked it instead: which page you opened and what you inspected.

### A change isn't finished when the code is

When behavior changes, update the surrounding material:

- **Documentation.** Update `AGENTS.md`, `README.md`, `CONTRIBUTING.md`, or `docs/` in the same change if commands, setup steps, environment requirements, or implementation details have changed. Outdated documentation is worse than none; people rely on it to make decisions.
- **Related tests.** Find and read the tests for the changed code, not just the ones that failed. A test may still pass while checking outdated behavior, an old name, or a branch that no longer exists. Update it in the same change.

Check: if any text in the repository is now inaccurate, the work isn't finished.

### Do not

- **Run `npm run deploy`.** It is not a build check; it runs rsync against `dev.doka.guide`.
- **Read or print `.env`.** It contains the production `GITHUB_TOKEN`.
- **Commit content symlinks** (`src/html`, `src/css`, `src/js`, and the other paths in `.gitignore`), `.issues.json`, `dist`, or `bin`.
- **Push to `main`.** Work through GitHub Flow: branch → pull request → review.

---

## 2. About this repository

The [doka.guide](https://doka.guide) site is a static generator built with [Eleventy](https://www.11ty.dev). It takes Markdown from the **separate** [`doka-guide/content`](https://github.com/doka-guide/content) repository and renders it with Nunjucks templates.

Content and platform code intentionally live in separate repositories: authors can work on materials without knowing the build system, while the platform can evolve independently. This is unusual for 11ty, which is why the project uses symlinks, `.11tydata.js` files, and manually defined collections.

Related projects in the ecosystem: `api` (Go backend for forms and newsletters) and `search` (search engine using an inverted index).

---

## 3. Getting started

```bash
npm i
cp .env.example .env
npm start          # http://localhost:8080
```

Use the Node.js version in `.nvmrc`. By default, `PATH_TO_CONTENT=../content`, so the content repository should be next to this one. The first time you run `npm start`, `make-links.js` asks for the path and creates symlinks.

Building all content takes a while. `CONTENT_REP_FOLDERS` in `.env` controls which folders are linked; the build only includes materials in those folders, which may be empty. For quick iterations, keep only the section you need and the required `settings` folder. See [`docs/how-its-work.md`](docs/how-its-work.md) for details.

The `.issues.json` file (contribution statistics from [`doka-guide/cache`](https://github.com/doka-guide/cache)) is not needed for development. Without it, `npm start` prints a warning and builds contributor pages with empty statistics. It is required for `npm run build`, which fails with a clear message if the file is missing. See [`docs/how-to-run.md`](docs/how-to-run.md) for how to get it.

---

## 4. Checking your work

From fastest to slowest. The first command covers most checks:

```bash
npm run check                         # tests + editorconfig + stylelint + eslint, ~5 sec
npx eslint <changed files>            # focused check without unrelated errors
npm start                             # inspect visually if you changed templates or transforms
npm run build && npm run lint:html    # markup validation; requires Java 17+
```

`npm run check` runs every check and prints a summary table. Don't use `npm run lint-check` instead: its commands are chained with `&&`, so an `editorconfig` failure hides the stylelint and eslint reports, leaving you to fix line endings instead of the real issue.

`lint:html` checks one page of each type, not the whole site. All articles use the same `doc.njk` template, so the thousandth article won't reveal anything the first one doesn't. The page list is in `scripts/lint-html.js`; add new page types there.

`editorconfig-checker` downloads its binary to `./bin/latest/` each time. That directory is in `.gitignore`.

Tests live in `__tests__/` next to the code; shared helpers are in `test/helpers/`. Coverage is still limited, so transforms are the best place to add tests: they are pure functions that take HTML and return HTML.

---

## 5. Repository map

| Location | Contents |
|---|---|
| `.eleventy.js` | Main configuration: collections, filters, transforms, plugins |
| `gulpfile.js` | Production pipeline: CSS/JS bundles and cache hashes |
| `make-links.js` | Symlinks from `src/{section}` to `content/{section}` |
| `config/` | Constants, environment, section colors |
| `src/data/` | Global 11ty data |
| `src/layouts/`, `src/includes/` | Base template and components |
| `src/views/` | Pages: `*.njk` templates and `*.11tydata.js` data |
| `src/transforms/` | Post-processing of generated HTML |
| `src/libs/` | Build utilities (Node.js) |
| `src/scripts/` | Client-side JavaScript; `index.js` entry point, bundled with esbuild |
| `src/styles/` | Block-based CSS; `index.css` entry point |
| `.github/workflows/` | CI: linters, tests, builds, previews, deployment |

Key template collections: `docs`, `docsById`, sections (`html`, `css`, `js`, `a11y`, `tools`, `recipes`), `articleIndexes`, `people`, `practice`, `question`, `answer`, `webFeatures`, and `posts`.

Article page data is assembled in `src/views/doc.11tydata.js`; data shared by all pages is in `src/views/views.11tydata.js`.

---

## 6. Conventions

**Code.** `semi: never`, single quotes, and a width of 120 are handled automatically by Prettier through ESLint. Use two-space indentation, LF line endings, and a final newline.

**Comments explain why, not what.** In this repository, comments explain a decision and its reasoning: why arm64 builds use a native runner, why a glob is quoted, or why `linkify` is disabled. Don't restate the code.

**Commit messages use the present tense and third person**, with the pull request number at the end:

```
Removes empty lines from search results (#1366)
Fixes arm64 builds, adds CI tests, and removes the unused GITHUB_TOKEN (#1365)
```

**Pull requests** target `main` and are reviewed according to CODEOWNERS. Run `npm run check` before pushing: tests are not included in the pre-commit hook, and CI runs them in a separate workflow.

The **pre-commit hook** (`simple-git-hooks` + `nano-staged`) fixes only staged files: `eslint --fix` for JS and `stylelint --fix` for CSS. It does not check untouched files, so lint issues can accumulate.

---

## 7. Further reading

- [`docs/how-to-run.md`](docs/how-to-run.md) — ways to run the project and `.issues.json`
- [`docs/how-its-work.md`](docs/how-its-work.md) — build process, environment variables, transforms, and templates
- [`docs/deploy.md`](docs/deploy.md) — deployment
- [`docs/deps.md`](docs/deps.md) — working with dependencies
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — how to contribute
