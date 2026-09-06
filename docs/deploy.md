# Deployment Docks

The document is hosted on the server as a set of static files.

## When we deploy

Deploy automatically when a pull request is merged into a branch mainin the repository contentor platform.

## How to assemble

The project is built using [GitHub Actions](https://docs.github.com/en/actions).

Each repository describes its own build workflow:

- [The content workflow](https://github.com/doka-guide/content/blob/main/.github/workflows/product-deploy.yml) — is one continuous pass: download, install, compile, send to the server;
- [The platform workflow](https://github.com/doka-guide/platform/blob/main/.github/workflows/product-deploy.yml) — consists of three jobs, described below:

### How the platform assembly works

The site is built `once`, and the results are scattered across jobs as artifacts. Previously, it was built twice: once for publication and once for markup verification.

1. The **build** is a reusable [build-site.yml](https://github.com/doka-guide/platform/blob/main/.github/workflows/build-site.yml): it downloads content and cache, installs dependencies, connects articles with symlinks, and builds the project. It produces two artifacts: a full one `site-dist` for publication and a smaller one  `site-html` with just pages—the validator doesn't need images. An inventory is also included: the archive's checksum, number of files, and number of pages.
1. Markup validation is `site-html` carried out by the W3C validator.
1. Publication — takes `site-dist`, checks the inventory and sends it to the server.

Publication depends only on the build, not on validation: red markings do not stop the rollout.

### What protects a combat site?

Publishing is done `rsync` with deletion of excess data, so an incomplete artifact is more dangerous than a failed deployment: it won't retain the old version, but will erase the missing data. Three lines of defense are in place:

1. Inventory verification before unpacking. If the checksum doesn't match, the deployment doesn't start. After unpacking, the file count is verified, and the build is rejected if it produced an unrealistically small number of pages.
1. Delete only after transfer (`--delete-after`). If the transfer is interrupted, nothing will be deleted: the previous version plus a partially updated version of the new one will remain on the server.
1. The deletion limit (`--max-delete`), calculated based on the assembly size. If the amount to be deleted is unrealistically large, `rsync` the process aborts and does not clean up the site.

No actions occur on the server side other than publishing the transferred folder with the assembly.

## Docker image

Docker [docker-deploy.yml](https://github.com/doka-guide/platform/blob/main/.github/workflows/docker-deploy.yml) workflow builds an image for two architectures, each with its own native runner, and then tags the shared manifest. Using QEMU emulation, the arm64 build failed occasionally.
