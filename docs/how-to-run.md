# How to run Doku locally

To work with the platform, you'll need [Node.js](https://nodejs.org/en/) and npm. We use the stable LTS version of Node.js and the included npm version. If you have a different version of Node.js installed, you can use [nvm](https://github.com/nvm-sh/nvm) to switch to the correct one.

## Minimum launch

To run Doku locally, you need to:

1. Download the repository.
1. Install dependencies with the command `npm i`.
1. Make a copy of the file  `.env.example` and name it `.env`. Set the required environment variables in it.
1. Start the local web server with the command  `npm start`.


## Launch with real content

1. Download repositories with content and platform into one folder.
1. Install dependencies with the command `npm i`.
1. Make a copy of the file `.env.example` and name it `.env`. Set the required environment variables in it:
  - `BASE_URL` - base address for the site;
  - `SECTIONS` - list of site sections;
  - `PATH_TO_CONTENT` - path to the repository with content;
  - `CONTENT_REP_FOLDERS` - folders with the contents of sections and service information for assembly;
  - `DOKA_ORG` - path to the organization on GitHub;
  - `PLATFORM_REP_GITHUB_URL` - path to the repository with the platform on GitHub;
  - `CONTENT_REP_GITHUB_URL` - path to the repository with content on GitHub;
  - `CONTENT_REP_GITHUB` - a link to a repository with content on GitHub for working with Git;
  - `SERVER_PATH` - absolute path to the folder on the server with the current build.
2. Start the local web server with the command `npm start`.

## File.issues.json

It calculates the activity of participants - how many pull requests and issues each person has.

It's not needed for development: without the file, `npm start` it will display a warning and generate user pages with empty statistics. However, the production build  (`NODE_ENV=production`) intentionally crashes without it to prevent the site from leaving without statistics.

The file isn't in the platform repository; it's maintained in a separate repository [doka-guide/cache](https://github.com/doka-guide/cache). It's copied from there automatically in CI. If you want to build the production version locally, manually place it in the root directory:

```bash
git clone --depth 1 https://github.com/doka-guide/cache.git ../doka-cache
cp ../doka-cache/issues.json .issues.json
```

The file has been added to .gitignore, no need to commit it.
