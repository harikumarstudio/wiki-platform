# Deploying to a server

The site is generated as static files and published to a web server over SSH. This guide describes that server deployment; it does not use GitHub Pages.

## Before deploying

The automated deployment requires:

- The site and its content repositories to be available to GitHub Actions.
- A server account with SSH access and write permission to the site's document root.
- The repository's GitHub Actions secrets `DEPLOY_KEY` and `DEPLOY_CONFIG`. The key authenticates the deployment, and the SSH config defines the `dev.doka.guide` host used by the workflow.

The current platform workflow publishes to `dev.doka.guide:/web/sites/doka.guide/www/`. Update the workflow and its SSH configuration if your server or document root differs.

## Deployment steps

1. Make and review changes in the platform or content repository.
2. Merge the changes into the repository's `main` branch. The platform deployment workflow runs when a commit is pushed to `main`; the content repository has its own deployment workflow.
3. In the platform workflow, GitHub Actions checks out the platform, content, and cache repositories, installs dependencies, and builds the site. The full static site is packaged as the `site-dist` artifact.
4. GitHub Actions also validates the generated HTML. This is a separate job: deployment depends on a successful build, not on HTML validation, so a validation failure does not by itself block publication.
5. Before publishing, the deploy job verifies the artifact checksum and file count, confirms that it contains `index.html`, and rejects a build with fewer than 1,000 HTML pages.
6. The deploy job connects to the server over SSH and uses `rsync` to transfer the site. It preserves the server's `api.json` and `mail` paths, removes obsolete files only after transfer, and aborts if the number of deletions exceeds its safety limit.
7. Check the GitHub Actions run to confirm that **Build site** and **Deploy site** succeeded, then open the deployed site and verify the updated pages.

## If deployment fails

Open the failed job in the GitHub Actions run and review its logs. A build or artifact-verification failure stops deployment. SSH and `rsync` errors usually indicate that the deployment key/configuration, server access, or destination path needs attention. Since excess files are deleted only after transfer and `rsync` has a deletion limit, a failed transfer should not proceed with an unrestricted cleanup.

## Docker image

The separate [Docker deployment workflow](../.github/workflows/docker-deploy.yml) builds and publishes a multi-architecture image. It does not publish the static site files to the web server; follow the server deployment steps above for the website.
