module.exports = {
  pagination: {
    data: 'collections.articleIndexes',
    size: 1,
    alias: 'articleIndex',
  },

  permalink: '/{{ articleIndex.fileSlug }}/index.json',

  eleventyComputed: {
    category: function (data) {
      const { articleIndex } = data
      return articleIndex.fileSlug
    },

    categoryArticles: function (data) {
      const { collections, category } = data
      return collections[category]
    },

    json: function (data) {
      const { category, categoryArticles } = data

      // This used to read the internal 11ty API — template._frontMatterDataCache
      // and template.inputContent. These are gone in version 3; everything we
      // need is in the public article.data and article.rawInput. Crucially,
      // rawInput no longer includes front matter, so there is no need to split
      // it on '---'.
      //
      // Async callbacks were also removed from filter and reduce. A Promise is
      // always truthy, so filter removed nothing, and reduce's accumulator
      // became a Promise after the first iteration. As a result, the file
      // contained one article instead of the entire section.
      // 11ty probes computed fields through a Proxy to learn which data they
      // read. During this pass, categoryArticles is not an array, so the guard
      // is required.
      if (!Array.isArray(categoryArticles)) {
        return {}
      }

      return categoryArticles
        .filter((article) => article.data.tags?.includes('doka'))
        .reduce((map, article) => {
          const lines = (article.rawInput ?? '').split('\n')
          const headingIndices = []

          lines.forEach((line, index) => {
            if (line.startsWith('## ')) {
              headingIndices.push(index)
            }
          })

          map[article.data.title] = {
            path: `/${category}/${article.fileSlug}/`,
            related: article.data.related,
            summary: lines
              .slice(0, headingIndices[1])
              .filter((line) => line !== '')
              .filter((line) => line !== '## Кратко'),
          }

          return map
        }, {})
    },
  },
}
