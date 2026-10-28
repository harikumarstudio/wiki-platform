# Doka Platform

[![Linting status](https://github.com/doka-guide/platform/actions/workflows/linting.yml/badge.svg?branch=main&event=push)](https://github.com/doka-guide/platform/actions/workflows/linting.yml)
[![Test status](https://github.com/doka-guide/platform/actions/workflows/tests.yml/badge.svg?branch=main&event=push)](https://github.com/doka-guide/platform/actions/workflows/tests.yml)
[![Deployment status](https://github.com/doka-guide/platform/actions/workflows/product-deploy.yml/badge.svg?branch=main&event=push)](https://github.com/doka-guide/platform/actions/workflows/product-deploy.yml)
[![Docker status](https://github.com/doka-guide/platform/actions/workflows/docker-deploy.yml/badge.svg?branch=main&event=push)](https://github.com/doka-guide/platform/actions/workflows/docker-deploy.yml)

[⚠️ If the Doka website loads slowly or doesn't work at all](docs/load-fix.md)

Doka is a friendly encyclopedia for web developers. Our goal is to make web development documentation practical, clear, and engaging.

Join [our Telegram community](https://t.me/doka_guide) to keep up with the latest news, or [chat with us](https://t.me/+qYFPI2mExuQxZTFi), ask questions, and have a good time.

This repository contains the platform for the [Doka website](https://doka.guide/). The platform builds articles from a [separate repository](https://github.com/doka-guide/content).

## How the site works

Doka is built with [Eleventy](https://www.11ty.dev). Eleventy uses Nunjucks templates to turn Markdown articles into HTML pages.

The project is built with GitHub Actions and hosted on a server. Read [more about deployment](./docs/deploy.md).

## Getting started

You need [Node.js](https://nodejs.org/en/) and npm to work with the platform.

To run Doka locally:

1. Clone the repository.
1. Copy `.env.example` to `.env` and set the required environment variables.
1. Install dependencies with `npm i`.
1. Start the local web server with `npm start`.

Find more ways to run Doka locally in the [launch guide](docs/how-to-run.md).

## Contributing

Read the [contributor guide](CONTRIBUTING.md) for the workflow, code and commit style, and checks to run before opening a pull request. If you use AI coding agents, they should read [AGENTS.md](AGENTS.md).

---

The code is distributed under the [MIT License](LICENSE.md). Fonts have their own licenses; see the [license documentation](docs/license.md) for details.

## Running tests

We use [Jest](https://jestjs.io/docs/getting-started).
Add tests in the `__tests__` folder. Test files should preferably have the same name as the file they cover.

Run tests with `npm test`.
To run tests in watch mode, use the `--watch` flag: `npm test -- --watch`.

## Debugging

Run `npm run debug`, then open `chrome://inspect` in Chrome.

Find the relevant session in the list, click `inspect`, and start debugging.

The debugger pauses immediately by default. To add more breakpoints, add `debugger;` to your code or set a breakpoint in the debugger interface.
