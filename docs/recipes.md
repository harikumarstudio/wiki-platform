# Frequently asked questions

Short recipes for typical platform changes. The general build process is described in the Doki guide , and launching is described in the launch guide .

## Add a block to the article page

1. The block template — `src/includes/blocks/my-block.njk`.
2. Styles are — `src/styles/blocks/my-block.css` a plus  `@import` in `src/styles/index.css`.
3. Connect to `src/views/doc.njk`: `{% include "blocks/my-block.njk" %}`.

## Add a calculated field to article data

In `src/views/doc.11tydata.js`, in object `eleventyComputed`:

```js
myField: function (data) {
  const { doc } = data
  return doc.data.someField
}
```

## Add transformation

1. Create src/transforms/my-transform.js— export function (window, content, outputPath). Almost all transformations only require window: the markup is edited in-place, no need to return anything.
2. Connect to .eleventy.js, in array transforms.
3. Cover with test in src/transforms/__tests__/- the transformation takes markup and returns markup, this is the cheapest type of test in the project.

## Add a client module

1. Create src/scripts/modules/my-module.js.
2. Import to src/scripts/index.js.
3. The component class inherits from BaseComponent- src/scripts/core/base-component.jsit extends EventTargetand adds on, off, emit.

Modules are initialized based on the presence of their elements in the DOM.

## Add a new type of page

In addition to the template and data, add the page to the list `PAGES` in `scripts/lint-html.js` - otherwise the new page type will not be checked for markup.

---

# Useful details

**Article front matter.** This material comes from the content repository:

```yaml
title: 'Заголовок'
description: 'Описание'
tags: [doka] # [article] [placeholder]
authors: [username]
contributors: [username]
editors: [username]
createdAt: '2021-01-01'
updatedAt: '2022-06-15'
cover:
  author: username
  desktop: desktop.png
  og: og.png
  twitter: twitter.png
related:
  - css/display
  - js/array
baseline:
  - group: css-display
    features: [display-flex]
```

Baseline. Browser support data is taken from the npm package web-features. The article declares a block baseline:in the frontmatter; the platform retrieves browser versions automatically.

Featured articles. The list is read from src/settings/featured.md—the file comes from the content repository via a symlink. Maximum 12 items.

Article sorting. Within a section, materials are sorted by title, ignoring case and non-alphanumeric characters, to ensure consistency between recompiles.

Themes. Light, dark, and auto; the choice is stored in localStoragethe key color-theme. Theme colors are in src/styles/base-colors.css, light-theme.css, dark-theme.css. Section colors are specified twice: in config/category-colors.jsJavaScript and using CSS variables in the themes.

Service Worker. Disabled. src/sw.jsIt remains a stub that deregisters and clears caches for those who have the old worker installed. Therefore, the file cannot be deleted; it must continue to be served via [service worker] /sw.js. The reasons for disabling it are in the comments in the file itself.

Social cards. Templates sc.njkand sc-index.njkindividual HTML pages for social media cards are compiled */index.sc.htmlin [ https://github.com/socialcards/social-cards/] dist. The images for these cards are taken outside of this repository; the platform only contains the markup.

Markdown-it. Configuration in src/markdown-it.js[ html: trueurl breaks: true] linkify: false(URLs are not automatically converted to links). Code highlighting is handled by CSS: the renderer wraps the block in [ url <pre data-lang="js"><code>…</code></pre>]. There's a dedicated renderer html_blockfor <video>[url]—it wraps the video in [ <figure>url] with a caption.
