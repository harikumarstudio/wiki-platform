module.exports = {
  title: 'Credits and Contributors',
  layout: 'base.njk',
  permalink: '/people/',

  eleventyComputed: {
    // Rule to hide contributor cards that don't belong to the selected sections.
    // Built from collections, so it can't be in a regular CSS file.
    // Previously it was delivered as a <style> tag directly in the page markup, but according to the specification, style is metadata and is only allowed in the head.
    pageStyles: function (data) {
      const sections = data.collections.articleIndexes || []
      const selector = sections
        .map((section) => `[data-filters*='${section.fileSlug}'] > *:not([data-categories*='${section.fileSlug}'])`)
        .join(', ')
      return selector ? `${selector} { display: none; }` : ''
    },
  },
}
