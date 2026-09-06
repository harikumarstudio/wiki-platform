# How does Doka work?

## Repositories

Doka lives on GitHub and works on several repositories:

- [Content](https://github.com/doka-guide/content), which contains all materials;
- [The platform](https://github.com/doka-guide/platform), that contains all the assembly code and client code for a web application;
- [The backend](https://github.com/doka-guide/api), which contains the Doki API;
- [Search](https://github.com/doka-guide/search), which stores the API for organizing content search.

Docs authors primarily interact with the `Content` repository , which stores docs, articles, and practices for all sections, as well as materials from the "At the Interview" section.

The `platform` is based on the 11ty static site generator . The site pages are designed as templates in the Nunjucks format .

The `backend` is a REST API implemented in Go. The API allows users to save completed forms and reactions to articles, and also serves as a platform for organizing email newsletters.

The `search` engine includes a search engine that allows you to search a pre-built inverted index. The index is generated during site deployment from the main branch.

The Content and Platform repositories are used to build a static site, while the Backend and Search repositories are used to make the site interactive.

All repositories are open, and we always welcome new contributors. Work in the repositories is organized according to the GitHub Flow model: there's a main branch `main`, which stores the current version of the product, and other branches containing changes that are reviewed through pull requests.

## Platform

To build a website, you need to connect Content. This is an independent repository that knows nothing about the Platform. The Platform knows a few things about Content: paths, section lists and colors, content settings, and the content folder structure.

Separating content and the platform into different repositories is an unconventional way to work with a project on 11ty. This approach eliminates some of the engine's standard functionality (for example, automatic date updates based on git history), but it allows us to:

- work with Docs materials directly without using assembly (assuming that all standard Markdown syntax is processed correctly on the platform side);
- develop the platform independently of materials (for example, there is no need to wait for all content to be assembled at each iteration; it is enough to work with standard materials);
- create less noise for developers and authors in the relevant repositories;
- conduct assembly testing independently;
- When assembling content and the platform, always receive the latest version of the content and the method of its presentation;
- Eliminates the need for authors to maintain the necessary developer environment (you can see the result in the preview generated with each push to GitHub in a pull request).

### Constants and default behavior

**List of environment variables**:

- `BASE_URL` — base address for the site;;
- `SECTIONS` — a list of the main sections of the site;;
- `PATH_TO_CONTENT` — path to the repository with content;;
- `CONTENT_REP_FOLDERS` — folders with the contents of sections and service information for assembly;
- `DOKA_ORG` — path to the organization on GitHub;
- `PLATFORM_REP_GITHUB_URL` — path to the repository with the platform on GitHub;
- `CONTENT_REP_GITHUB_URL` — path to the repository with content on GitHub;
- `CONTENT_REP_GITHUB` — a link to a repository with content on GitHub for working with Git;
- `SERVER_PATH` — absolute path to the folder on the server with the current build;
- `GITHUB_TOKEN` — is a token for working with GitHub's GraphQL API. [Instructions for generating a personal token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

The _settings_ folder from the list `CONTENT_REP_FOLDERS` is required for the build. If you leave this field `GITHUB_TOKEN` blank, information about their GitHub activity in the content repository will not be displayed on the contributor pages.

The list of Docs sections included in the site build is defined by a variable `SECTIONS` in the [_.env.example_](https://github.com/doka-guide/platform/blob/main/.env.example) file, where environment variables are set (more information on mandatory configuration before launch [is available in the documentation](https://github.com/doka-guide/platform/blob/main/docs/how-to-run.md)), and [_constants.js_](https://github.com/doka-guide/platform/blob/main/config/constants.js), which specifies default values ​​if they are not specified in the environment variable file. The folders containing section content may be empty or absent altogether. The build will only consider content contained in these folders. The folder structure should be as follows:

```bash
section                         # Section folder
  └── doka-or-article           # Material folder
      ├── demos                 # Demos folder
      │    └── first-demo       # Demos folder
      │         └── index.html  # Demo page (loads in <iframe>)
      ├── images                # Folder for pictures
      │    └── picture.png      # Image files
      ├── practice              # Folder for the "In Practice" section
      │    └── author.md        # Text for the "In Practice" section by a specific author
      └── index.md              # Content of the material (documentation/article)
```

Section colors are defined in the files::
- [_category-colors.js_](https://github.com/doka-guide/platform/blob/main/config/category-colors.js);
- [_base-colors.css_](https://github.com/doka-guide/platform/blob/main/src/styles/base-colors.css) — base colors;
- [_light-theme.css_](https://github.com/doka-guide/platform/blob/main/src/styles/light-theme.css) — for the light theme;
- [_dark-theme.css_](https://github.com/doka-guide/platform/blob/main/src/styles/dark-theme.css) — for the dark theme.

#### Paths

The site is built from two repositories for the Platform, so a set of paths containing the Content assets must be prepared before building. To do this, the [_make-links.js_](https://github.com/doka-guide/platform/blob/main/make-links.js) script is executed in one of two modes: locally for users (in interactive mode), and on the server (in deployment mode). By default, folders from the Content are embedded via links in the src/ folder.

Platform folder structure::

```bash
platform
  ├── .github         # GitHub working folder
  ├── config          # Configuration files folder
  ├── docs            # Platform Documentation Docs
  ├── scripts         # Utility scripts: markup checks and validation
  ├── test            # Test helpers not tied to a single module
  └── src             # Source code for building
      ├── data        # Data-bound folder (11ty entity)
      ├── fonts       # Folder with prepared fonts
      ├── images      # Folder containing icons and non-content images for the site
      ├── includes    # Folder with templates of some blocks
      ├── layouts     # Folder containing the page layout framework
      ├── libs        # Folder containing libraries for the build
      ├── scripts     # Folder containing build and client scriptss
      ├── styles      # Site styles
      ├── transforms  # Transformations (the essence of 11ty)
      └── views       # Main site page views
```

#### Website assembly

_.eleventy.js_ is the main build file. It contains the 11ty engine configuration.

Entities of the 11ty:

- content - texts on the site (in Doc, content files are stored in subfolders of the src folder with *.md and *.html extensions ) and various media files;
- templates are the main way to generate markup (in Docs, these are files with markup for pages or page blocks with *.njk extensions );
data - pre-recorded or specially prepared data using JavaScript that is needed for assembly (in Docs, these are files with the *.11tydata.js extension );
- collections are a special engine object that can store specially prepared data (in Doc, collections are specified in the main configuration file);
- transformations - the process of processing already completed website pages;
- Permalinks are permanent URLs for pages that differ from those installed by 11ty and are manually specified by the user. They are used to provide the engine with flexibility regarding the content file storage path.

The website is assembled in the following order:

1. Search for files with layout (templates) and content in the repository by the specified paths.
2. Loop through all found files:
    - Generates a list of all files that are not content files (in the Doc, these are fonts, styles, client scripts, icons, photos, videos, etc.).
    - Pre-processing templates and preparing content for templates.
3. Asynchronous copying of all files that are not content files. Copying occurs in parallel with the preliminary stages.
4. Generating data and calculated values ​​for assembly (to fill ready-made templates with content).
5. Construction of the dependency graph in the following order:

    - handling templates that do not contain dependencies;
    - processing templates that use tags (built-in field in the meta of content files);
    - processing templates that use pagination and any other collections;
    - handling templates that use pagination and the Configuration API to add collections;
    - processing templates that use pagination and prepare local objects with collections collection;
    - Processing templates that use pagination and prepare a global object with collections collection.all.
6. Forming collections in the correct order for a dependency graph.
7. Formation of an additional dependency graph for the generation of calculated data, permalinks, and paths to source files with content.
8. Processing templates without generating page markup.
9. Check for duplicates.
10. Processing templates with final page layout.
11. Applying transformations.

The configuration file configures the folders that store different entity types. In the Dock, folders are used as follows:

- _dist/_ —  for the assembled site;
- _src/_ —  for the source code of the site;
- _src/data/_ — for global site data;
- _src/includes/_ — for marking page blocks;
- _src/layouts/_ — for the main page layout.

The library is used as the primary library for processing content files `markdown-it`However, by default, the library doesn't process video as expected in Doc. Therefore, [a custom solution](https://github.com/doka-guide/platform/blob/main/src/markdown-it.js) is used.

When building a Doki website, special attention is paid to transformations, that is, post-processing of the finished page layout. The following transformations are used:

1. `answers-link-transform` — edits the paths to demos and images included in the "In Practice" section.
1. `article-code-blocks-transform` — generates markup for blocks with code in the text of materials with the ability to copy.
1. `article-inline-code-transform` — generates markup for code in the text of materials with the ability to copy.
1. `callout-transform` — generates markup for collouts.
1. `code-breakify-transform` — hyphenates text for code.
1. `code-classes-transform` — places classes on inline code blocks.
1. `color-picker-transform` — adds color-coded squares to the code after the mention.
1. `demo-external-link-transform` — adds links to open demos in a new window.
1. `demo-link-transform` — edits the paths to demos and images included in the "In Practice" section.
1. `details-transform` — wraps content `<details>` in blocks with the class `.content`.
1. `headings-anchor-transform` — generates anchor links to headings.
1. `headings-id-transform` — generates markup for forming `id` heading attributes.
1. `iframe-attr-transform` — adds attributes to `<iframe>` if they do not exist.
1. `image-place-transform` — places images with captions inside `<figure>`.
1. `image-transform` — prepares images in different formats to optimize page loading.
1. `link-transform` — adds classes to links.
1. `table-transform` — wraps tables in scrollable containers.
1. `toc-transform` — generates the page table of contents.

#### Tests

In Doc, we use unit testing with the [Jest](https://jestjs.io). Its configuration is located in the [_jest.config.js_](https://github.com/doka-guide/platform/blob/main/jest.config.js). file . *__The tests__* themselves are in the tests / subfolder next to the tests they test.

#### Launch scripts

The platform can be operated in different modes (described in the[_package.json_](https://github.com/doka-guide/platform/blob/main/package.json)):

- `debug` — for debugging the platform and content (the site doesn't crash if something goes wrong, but informs you about what happened);
- `start` — to launch the platform locally with automatic reboot when content or platform files are changed;
- `build` — for website assembly (with code minification and all transformations);
- `deploy` — to deploy a website on the Doki infrastructure (if access is available);
- `editorconfig` — to check files for Editorconfig requirements, according to [конфигурации](https://github.com/doka-guide/platform/blob/main/.editorconfig);
- `lint:css` — to check styles for Stylelint requirements, according to [конфигурации](https://github.com/doka-guide/platform/blob/main/.stylelintrc.json);
- `lint:js` — to check scripts for ESLint requirements, according to [конфигурации](https://github.com/doka-guide/platform/blob/main/eslint.config.js);
- `lint:html` — to check the validity of the collected markup, one page of each type (collected dist and Java are needed);
- `lint-check` — running all linters in a row;
- `check` — tests and fast linters in one run, without interrupting each other;
- `test` — running unit tests;
- `make-links` — to form symbolic links to content.

#### Templates

The templates in Doc are implemented using [Nunjucks](https://mozilla.github.io/nunjucks/). The src/layouts folder contains one base template, base.njk , with the basic markup for any page on the site. It generates the main `<head>` and `<body>` tags `<html>`, `<head>` includes `<body>` microdata and meta tags using _meta.njk_ , and includes styles and client-side scripts.

The site page templates are located in the _src/views_ folder :

- _[404.njk](https://github.com/doka-guide/platform/blob/main/src/views/404.njk)_ — a page that is displayed if there is no page at the specified address;
- _[all.njk](https://github.com/doka-guide/platform/blob/main/src/views/all.njk)_ — a page with an index of all materials (documents, articles);
- _[article-index.njk](https://github.com/doka-guide/platform/blob/main/src/views/article-index.njk)_ — pages with an index of materials for each section;
- _[article-index-json.njk](https://github.com/doka-guide/platform/blob/main/src/views/article-index-json.njk)_ — abbreviated section content in JSON format: path, related materials, and a short description of each document;
- _[doc.njk](https://github.com/doka-guide/platform/blob/main/src/views/doc.njk)_ — pages with materials;
- _[doc-json.njk](https://github.com/doka-guide/platform/blob/main/src/views/doc-json.njk)_ — material in JSON format: links, images, videos, and demos found in the text;
- _[feed.njk](https://github.com/doka-guide/platform/blob/main/src/views/feed.njk)_ — XML document for organizing a feed for RSS;
- _[featured-json.njk](https://github.com/doka-guide/platform/blob/main/src/views/featured-json.njk)_ — a list of featured materials in JSON format;
- _[index.njk](https://github.com/doka-guide/platform/blob/main/src/views/index.njk)_ — the main page of the site;
- _[page.njk](https://github.com/doka-guide/platform/blob/main/src/views/page.njk)_ — pages with texts that are not materials;
- _[offline.njk](https://github.com/doka-guide/platform/blob/main/src/views/offline.njk)_ — a page with a message about the absence of a network; currently unused because the service worker is disabled;
- _[people.njk](https://github.com/doka-guide/platform/blob/main/src/views/people.njk)_ — page with a list of participants (contributors);
- _[people-csv.njk](https://github.com/doka-guide/platform/blob/main/src/views/people-csv.njk)_ — list of participants in CSV format;
- _[people-index.njk](https://github.com/doka-guide/platform/blob/main/src/views/people-index.njk)_ — photos and links to member pages in JSON format;
- _[people-info.njk](https://github.com/doka-guide/platform/blob/main/src/views/people-info.njk)_ — summary information about all participants in JSON format;
- _[person-json.njk](https://github.com/doka-guide/platform/blob/main/src/views/person-json.njk)_ — information about a project participant in JSON format;
- _[person.njk](https://github.com/doka-guide/platform/blob/main/src/views/person.njk)_ — personal pages of participants;
- _[sc-index.njk](https://github.com/doka-guide/platform/blob/main/src/views/sc-index.njk)_ — cards for social networks (needed to create images for social networks) in HTML format for sections;
- _[sc.njk](https://github.com/doka-guide/platform/blob/main/src/views/sc.njk)_ — cards for social networks (needed to create images for social networks) in HTML format for materials;
- _[sc-all.njk](https://github.com/doka-guide/platform/blob/main/src/views/sc-all.njk)_ — social media card for the page with all materials;
- _[search.njk](https://github.com/doka-guide/platform/blob/main/src/views/search.njk)_ — page requested;
- _[sitemap.njk](https://github.com/doka-guide/platform/blob/main/src/views/sitemap.njk)_ — XML document with a sitemap;
- _[specials.njk](https://github.com/doka-guide/platform/blob/main/src/views/specials.njk)_ — pages of special projects;
- _[subscribe.njk](https://github.com/doka-guide/platform/blob/main/src/views/subscribe.njk)_ — a page for managing your email newsletter subscription.

Templates for individual page blocks are located in the _src/includes_ folder :

- _[analytics/google.njk](https://github.com/doka-guide/platform/blob/main/src/includes/analytics/google.njk)_ — connecting Google Analytics to the website;
- _[analytics/metrika.njk](https://github.com/doka-guide/platform/blob/main/src/includes/blocks/article-image.njk)_ — connecting Yandex.Metrica to the website;
- _[blocks/article-image.njk](https://github.com/doka-guide/platform/blob/main/src/includes/blocks/article-image.njk)_ — illustrations of materials;
- ~~_[blocks/aside.njk](https://github.com/doka-guide/platform/blob/main/src/includes/blocks/aside.njk)_ — вёрстка страниц с боковой навигацией (пока не используется)~~;
- _[blocks/cookie-notification.njk](https://github.com/doka-guide/platform/blob/main/src/includes/blocks/cookie-notification.njk)_ — pop-up with information about cookie usage;
- _[blocks/featured-article.njk](https://github.com/doka-guide/platform/blob/main/src/includes/blocks/featured-article.njk)_ — a block for displaying one material for featuring on the main page of the site;
- _[blocks/footer.njk](https://github.com/doka-guide/platform/blob/main/src/includes/blocks/footer.njk)_ — website footer (theme switcher, secondary menu);
- _[blocks/header.njk](https://github.com/doka-guide/platform/blob/main/src/includes/blocks/header.njk)_ — website header (logo, breadcrumbs, search, main menu);
- _[blocks/linked-article.njk](https://github.com/doka-guide/platform/blob/main/src/includes/blocks/linked-article.njk)_ — buttons for going to the previous or next material in a section;
- _[blocks/logo.njk](https://github.com/doka-guide/platform/blob/main/src/includes/blocks/logo.njk)_ — logo layout;
- _[blocks/nav-list.njk](https://github.com/doka-guide/platform/blob/main/src/includes/blocks/nav-list.njk)_ — menu with a list of site sections;
- _[blocks/person-avatar.njk](https://github.com/doka-guide/platform/blob/main/src/includes/blocks/person-avatar.njk)_ — participant avatar;
- _[blocks/person-badges.njk](https://github.com/doka-guide/platform/blob/main/src/includes/blocks/person-badges.njk)_ — a set of participant badges;
- _[blocks/person.njk](https://github.com/doka-guide/platform/blob/main/src/includes/blocks/person.njk)_ — presentation of brief information about a participant on the page with a list of participants;
- _[blocks/search-category.njk](https://github.com/doka-guide/platform/blob/main/src/includes/blocks/search-category.njk)_ — category filter for the search page;
- _[blocks/search-hits.njk](https://github.com/doka-guide/platform/blob/main/src/includes/blocks/search-hits.njk)_ — one search result with brief information about the material;
- _[blocks/search-tags.njk](https://github.com/doka-guide/platform/blob/main/src/includes/blocks/search-tags.njk)_ — filter by material type for the search page;
- _[blocks/search.njk](https://github.com/doka-guide/platform/blob/main/src/includes/blocks/search.njk)_ — search block in the main menu;
- _[blocks/snow-toggle.njk](https://github.com/doka-guide/platform/blob/main/src/includes/blocks/snow-toggle.njk)_ — a toggle for falling snow (launched during the New Year holidays);
- _[blocks/snow.njk](https://github.com/doka-guide/platform/blob/main/src/includes/blocks/snow.njk)_ — a block that implements falling snow (launched during the New Year holidays);
- _[blocks/social-card.njk](https://github.com/doka-guide/platform/blob/main/src/includes/blocks/social-card.njk)_ — card for social networks;
- _[blocks/theme-toggle.njk](https://github.com/doka-guide/platform/blob/main/src/includes/blocks/theme-toggle.njk)_ — website theme switcher;
- _[articles-gallery.njk](https://github.com/doka-guide/platform/blob/main/src/includes/articles-gallery.njk)_ — a block with all the materials on the main page that were selected for featuring (the list of materials is updated weekly);
- _[contributors.njk](https://github.com/doka-guide/platform/blob/main/src/includes/contributors.njk)_ — a block for materials that displays all participants;
- _[feedback-form.njk](https://github.com/doka-guide/platform/blob/main/src/includes/feedback-form.njk)_ — a form for sending feedback on materials;
- _[meta.njk](https://github.com/doka-guide/platform/blob/main/src/includes/meta.njk)_ — connecting icons, manifests, fonts, and styles, configuring available themes, generating meta tags and micro-markup for pages;
- _[practices.njk](https://github.com/doka-guide/platform/blob/main/src/includes/practices.njk)_ — a section of the "In Practice" section in materials;
- _[questions.njk](https://github.com/doka-guide/platform/blob/main/src/includes/questions.njk)_ — a section of the "At the interview" section in the materials;
- _[related-articles-gallery.njk](https://github.com/doka-guide/platform/blob/main/src/includes/related-articles-gallery.njk)_ — a block for presenting documents and articles related to the current material;
- _[subscribe-popup.njk](https://github.com/doka-guide/platform/blob/main/src/includes/subscribe-popup.njk)_ — a popup for sending emails to subscribe to the newsletter.
