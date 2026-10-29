module.exports = {
  layout: false,
  permalink: '/search-index.json',

  eleventyComputed: {
    searchIndex: function ({ collections }) {
      return collections.docs.map((doc) => {
        const category = doc.filePathStem.split('/')[1]

        return {
          title: doc.data.title,
          description: doc.data.description || '',
          content: doc.rawInput || '',
          link: `/${category}/${doc.fileSlug}/`,
          category,
          tags: doc.data.tags || [],
        }
      })
    },
  },
}
