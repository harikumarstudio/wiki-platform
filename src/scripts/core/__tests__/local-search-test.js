import { searchArticles } from '../local-search.js'

const articles = [
  {
    title: 'C++ Basics',
    description: 'Learn programming basics',
    content: 'Variables and functions in a C++ program.',
    link: '/cpp/basics/',
    category: 'cpp',
    tags: ['article'],
  },
  {
    title: 'Houdini Dice',
    description: 'Model a dice in Houdini',
    content: 'Create a box and bevel its edges.',
    link: '/houdini/dice/',
    category: 'houdini',
    tags: ['article'],
  },
]

describe('searchArticles', () => {
  it('returns matching entries from the supplied local index only', () => {
    const results = searchArticles(articles, 'bevel edges')

    expect(results.map(({ link }) => link)).toEqual(['/houdini/dice/'])
  })

  it('applies category and tag filters', () => {
    const results = searchArticles(articles, 'basics', [
      { key: 'category', val: 'cpp' },
      { key: 'tags', val: 'article' },
    ])

    expect(results.map(({ link }) => link)).toEqual(['/cpp/basics/'])
  })

  it('requires all query terms to match', () => {
    expect(searchArticles(articles, 'houdini python')).toEqual([])
  })

  it('escapes article text while marking matches', () => {
    const results = searchArticles([{ ...articles[0], title: 'C++ & stuff' }], 'c++')

    expect(results[0].title).toBe('<mark>C++</mark> &amp; stuff')
  })
})
