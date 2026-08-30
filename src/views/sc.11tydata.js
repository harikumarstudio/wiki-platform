const { titleFormatter } = require('../libs/title-formatter/title-formatter')

module.exports = {
  pagination: {
    data: 'collections.docs',
    size: 1,
    alias: 'doc',
  },

  permalink: '{{doc.filePathStem}}.sc.html',

  eleventyComputed: {
    // Required for the <title> on the card page: it is mandatory in the <head>
    // according to the specification, even though the page itself is only needed for a screenshot.
    documentTitle: function (data) {
      const { doc } = data
      return titleFormatter([doc.data.title, 'ArchVizWiki'], { separator: ' | ' })
    },

    cover: function (data) {
      const { doc } = data
      return doc.data.cover
    },

    docPath: function (data) {
      const { doc } = data
      return doc.filePathStem.replace('index', '')
    },

    category: function (data) {
      const { doc } = data
      return doc.filePathStem.split('/')[1]
    },

    categoryName: function (data) {
      const { category, collections } = data
      return collections.articleIndexes.find((section) => section.fileSlug === category)?.data.name
    },
  },
}
