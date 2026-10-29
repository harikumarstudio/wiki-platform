import { escape } from 'html-escaper'

function stripMarkdown(text) {
  return text
    .replace(/```[^\n]*\n?/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[`*_>#~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function highlight(text, terms) {
  const escapedText = escape(text)
  const pattern = terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')

  return pattern ? escapedText.replace(new RegExp(`(${pattern})`, 'gi'), '<mark>$1</mark>') : escapedText
}

function getSnippet(text, terms) {
  const matchIndex = terms.reduce((index, term) => {
    const termIndex = text.toLowerCase().indexOf(term)
    return termIndex === -1 ? index : index === -1 ? termIndex : Math.min(index, termIndex)
  }, -1)
  const start = Math.max(0, (matchIndex === -1 ? 0 : matchIndex) - 60)
  const snippet = text.slice(start, start + 150)
  const prefix = start > 0 ? '…' : ''
  const suffix = start + 150 < text.length ? '…' : ''

  return `${prefix}${highlight(snippet, terms)}${suffix}`
}

export function searchArticles(articles, query, filters = [], limit = 50) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)

  if (terms.length === 0) {
    return []
  }

  const categories = filters.filter(({ key }) => key === 'category').map(({ val }) => val)
  const tags = filters.filter(({ key }) => key === 'tags').map(({ val }) => val)

  return articles
    .map((article) => {
      const title = stripMarkdown(article.title)
      const description = stripMarkdown(article.description)
      const content = stripMarkdown(article.content)
      const searchableText = `${title} ${description} ${content}`.toLowerCase()

      if (
        (categories.length > 0 && !categories.includes(article.category)) ||
        (tags.length > 0 && !tags.some((tag) => article.tags.includes(tag))) ||
        !terms.every((term) => searchableText.includes(term))
      ) {
        return null
      }

      const titleText = title.toLowerCase()
      const descriptionText = description.toLowerCase()
      const score = terms.reduce(
        (total, term) =>
          total +
          (titleText.includes(term) ? 8 : 0) +
          (descriptionText.includes(term) ? 4 : 0) +
          (searchableText.includes(term) ? 1 : 0),
        0,
      )
      const snippetSource = terms.some((term) => descriptionText.includes(term)) ? description : content || description

      return {
        title: highlight(title, terms),
        link: article.link,
        category: article.category,
        tags: article.tags,
        fragments: snippetSource ? [getSnippet(snippetSource, terms)] : [],
        score,
      }
    })
    .filter(Boolean)
    .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title))
    .slice(0, limit)
}
