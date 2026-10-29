# Deploying to Netlify

The site is built from this platform repository and `harikumarstudio/wiki-content`, then published to the existing Netlify site by GitHub Actions. Deployment is manual; pushing a commit does not start it automatically.

## One-time setup

### 1. Confirm the Netlify site

In Netlify, open the existing **archviz-wiki** site and copy its **Site ID** from the site settings. Use the ID for that existing site, not its name or URL. This ensures deployments target the intended site instead of creating or selecting another project.

### 2. Add GitHub Actions settings

In the `harikumarstudio/wiki-platform` repository, open **Settings → Secrets and variables → Actions** and add:

- **Repository variable** `NETLIFY_SITE_ID` — the Site ID copied from the existing `archviz-wiki` site.
- **Repository secret** `NETLIFY_AUTH_TOKEN` — a Netlify personal access token authorized to deploy to that site.
- **Repository secret** `CONTENT_REPO_TOKEN` — needed only if `harikumarstudio/wiki-content` is private. It must have read access to that repository.

The workflow checks that `NETLIFY_SITE_ID` and `NETLIFY_AUTH_TOKEN` are present before deploying. It passes the Site ID explicitly to Netlify CLI, so it will fail rather than create a new site if the ID is missing.

No SSH deployment settings or Netlify build-hook settings are needed for this workflow.

## Run a deployment

1. Make and review changes in `wiki-platform` or `wiki-content`. The workflow always builds from the configured `harikumarstudio/wiki-content` repository.
2. In GitHub, open the `wiki-platform` repository's **Actions** tab and select **Netlify Deploy**.
3. Select **Run workflow**, choose the platform branch to build, and confirm **Run workflow**. The workflow runs only when manually started.
4. GitHub Actions checks out the platform, the content repository with its full Git history, and the build cache. It installs dependencies, builds the full static site, and uploads the result as the `site-dist` artifact.
5. The deploy job verifies the artifact checksum and file count, confirms that `index.html` is present, and extracts the complete site. It then uses Netlify CLI with `NETLIFY_SITE_ID` to publish the artifact as a production deployment.
6. A separate job validates generated HTML. It runs alongside deployment after the build; a markup validation failure does not block publishing.
7. Check the workflow run's **Build site** and **Deploy site** jobs, then open the site's configured Netlify domain or custom domain and verify the updated pages.

Each run builds and publishes the complete generated site from the artifact, rather than uploading only changed pages.

## If deployment fails

Open the failed job in the workflow run and review its logs:

- **`NETLIFY_SITE_ID is empty`** — add or correct the repository variable. Use the ID from the existing `archviz-wiki` site.
- **`NETLIFY_AUTH_TOKEN is empty` or `Unauthorized`** — add or replace the repository secret with a valid token that can access the target site.
- **Content checkout fails** — if `wiki-content` is private, add or update `CONTENT_REPO_TOKEN` with read access.
- **Build or artifact verification fails** — deployment stops; inspect the build output or artifact-verification error before retrying.
- **HTML validation fails** — this is reported by the separate validation job and does not, by itself, stop the deployment job.
