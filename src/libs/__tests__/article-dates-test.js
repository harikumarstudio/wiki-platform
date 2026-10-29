const fs = require('fs')
const os = require('os')
const path = require('path')

describe('getArticleDates', () => {
  let contentPath
  let getArticleDates

  beforeEach(() => {
    contentPath = fs.mkdtempSync(path.join(os.tmpdir(), 'article-date-lookup-'))
    jest.resetModules()
    jest.doMock('../../../config/constants', () => ({ defaultPathToContent: contentPath }))
    getArticleDates = require('../article-dates')
  })

  afterEach(() => {
    jest.dontMock('../../../config/constants')
    jest.resetModules()
    fs.rmSync(contentPath, { recursive: true, force: true })
  })

  it('reads the date file from the article folder', () => {
    const articlePath = path.join(contentPath, 'ai', 'ai-basic')
    const expectedDates = {
      createdAt: '2026-10-28T10:00:00+00:00',
      updatedAt: '2026-10-29T10:00:00+00:00',
    }
    fs.mkdirSync(articlePath, { recursive: true })
    fs.writeFileSync(path.join(articlePath, 'article-date.json'), JSON.stringify(expectedDates))

    expect(getArticleDates({ filePathStem: '/ai/ai-basic/index' })).toEqual(expectedDates)
  })

  it('returns undefined when the article has no generated date file', () => {
    expect(getArticleDates({ filePathStem: '/ai/ai-basic/index' })).toBeUndefined()
  })
})
