# Contributing to the Doka platform

Thank you for wanting to help. This repository is the engine behind [doka.guide](https://doka.guide). If you want to edit an **article**, use the [content repository](https://github.com/doka-guide/content): articles, practical tips, and contributor pages live there.

## Workflow

We use GitHub Flow: `main` contains the current version of the product, and changes are merged through pull requests.

1. Fork the repository and create a branch from `main`.
2. Make your changes.
3. Run the checks: `npm run check`.
4. Open a pull request against `main` and wait for review. Reviewers are assigned according to `CODEOWNERS`.

Each pull request gets a site preview; its link is posted as a comment.

## Running locally

```bash
npm i
cp .env.example .env
npm start
```

See the [launch guide](docs/how-to-run.md) for details and other options. For development, the content repository should be next to the platform repository. You don't need to prepare `.issues.json`; contribution statistics will be empty without it.

Building all content takes a while. The `CONTENT_REP_FOLDERS` setting in `.env` controls which folders are linked. For faster iterations, you can include just the section you need and the required `settings` folder.

## Checks

```bash
npm run check                        # tests and linters; show all reports
npm run build && npm run lint:html   # markup validation; requires Java 17+
```

`npm run check` continues after a failure so you can see all issues in one run. Tests are not included in the pre-commit hook, so run them before pushing; CI runs them in a separate workflow.

The pre-commit hook fixes formatting only in staged files: `eslint --fix` for JavaScript and `stylelint --fix` for CSS.

## Style

**Code.** We omit semicolons, use single quotes, and indent by two spaces. Prettier handles this, so you don't need to check it manually.

**Comments explain why, not what.** A good comment explains the reasoning behind a decision: why arm64 is built on a native runner, why `linkify` is disabled, or why the validator checks one page of each type. Don't restate the code.

**Commit messages use the present tense and third person**, with the pull request number at the end:

```
Removes empty lines from search results (#1366)
Fixes arm64 builds, adds CI tests, and removes the unused GITHUB_TOKEN (#1365)
```

## Tests

We use Jest. Tests live in `__tests__/` folders next to the code they cover; shared helpers are in `test/helpers/`.

Tests are required in pull requests:

- For a bug fix, include a test that reproduces the issue: it should fail before the fix and pass afterward.
- For a feature, include a test for it.

If the change is in a Nunjucks template or CSS and cannot be tested directly, describe how you checked it in the pull request: which page you opened and what you verified.

Always add a test for a transform: it takes markup as input and returns markup, making it one of the easiest parts of the project to test.

Also read the existing tests related to the changed code—not just the ones that failed. A test may still pass while checking outdated behavior; update it in the same pull request.

## Documentation

If a change affects commands, setup steps, environment requirements, or how the build works, update the nearby documentation: `README.md`, `docs/`, and `AGENTS.md`. This is part of the same change, not a separate task: people make decisions based on documentation, and outdated documentation is worse than none.

## Further reading

- [`docs/how-to-run.md`](docs/how-to-run.md) — running the project
- [`docs/how-its-work.md`](docs/how-its-work.md) — how the build works
- [`docs/recipes.md`](docs/recipes.md) — recipes for common changes
- [`docs/deps.md`](docs/deps.md) — working with dependencies
- [`AGENTS.md`](AGENTS.md) — instructions for AI agents working on the code
