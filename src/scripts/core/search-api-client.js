import { searchArticles } from './local-search.js'

class SearchAPIClient {
  constructor(indexUrl) {
    this.indexUrl = indexUrl
    this.indexPromise = null
  }

  getIndex() {
    if (!this.indexPromise) {
      this.indexPromise = fetch(this.indexUrl, {
        headers: {
          Accept: 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Search index request failed: ${response.status}`)
          }
          return response.json()
        })
        .catch((error) => {
          this.indexPromise = null
          throw error
        })
    }

    return this.indexPromise
  }

  search(query, filters = []) {
    return this.getIndex().then((articles) => searchArticles(articles, query, filters))
  }
}

const searchClient = new SearchAPIClient('/search-index.json')

export default searchClient
