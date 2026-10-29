const fs = require('fs')
const os = require('os')
const path = require('path')
const { parseGitLog, writeArticleDates } = require('../generate-article-dates')

describe('parseGitLog', () => {
  it('records the first and most recent commit dates for each file', () => {
    const log = [
      'COMMIT:2026-10-29T10:00:00+00:00',
      'cpp/one/index.md',
      'cpp/two/index.md',
      '',
      'COMMIT:2026-10-28T10:00:00+00:00',
      'cpp/one/index.md',
    ].join('\n')

    expect(parseGitLog(log)).toEqual({
      'cpp/one/index.md': {
        createdAt: '2026-10-28T10:00:00+00:00',
        updatedAt: '2026-10-29T10:00:00+00:00',
      },
      'cpp/two/index.md': {
        createdAt: '2026-10-29T10:00:00+00:00',
        updatedAt: '2026-10-29T10:00:00+00:00',
      },
    })
  })

  it('ignores non-Markdown files', () => {
    expect(parseGitLog('COMMIT:2026-10-29T10:00:00+00:00\ncpp/image.png')).toEqual({})
  })
})

describe('writeArticleDates', () => {
  it('writes one date file beside each article index', () => {
    const contentPath = fs.mkdtempSync(path.join(os.tmpdir(), 'article-dates-'))
    const articlePath = path.join(contentPath, 'ai', 'ai-basic')
    const removedArticlePath = path.join(contentPath, 'ai', 'removed')
    fs.mkdirSync(articlePath, { recursive: true })
    fs.mkdirSync(removedArticlePath, { recursive: true })
    fs.writeFileSync(path.join(articlePath, 'index.md'), '')
    fs.writeFileSync(path.join(removedArticlePath, 'article-date.json'), '{}')

    const articleDates = {
      'ai/ai-basic/index.md': {
        createdAt: '2026-10-28T10:00:00+00:00',
        updatedAt: '2026-10-29T10:00:00+00:00',
      },
      'ai/ai-basic/practice/author.md': {
        createdAt: '2026-10-28T10:00:00+00:00',
        updatedAt: '2026-10-29T10:00:00+00:00',
      },
      'ai/language/index.md': {
        createdAt: '2026-10-28T10:00:00+00:00',
        updatedAt: '2026-10-29T10:00:00+00:00',
      },
    }

    try {
      expect(writeArticleDates(articleDates, contentPath, ['ai'])).toBe(1)
      expect(fs.readFileSync(path.join(articlePath, 'article-date.json'), 'utf8')).toBe(
        `${JSON.stringify(articleDates['ai/ai-basic/index.md'])}\n`,
      )
      expect(fs.existsSync(path.join(removedArticlePath, 'article-date.json'))).toBe(false)
      expect(fs.existsSync(path.join(contentPath, '.article-dates.json'))).toBe(false)
    } finally {
      fs.rmSync(contentPath, { recursive: true, force: true })
    }
  })
})
