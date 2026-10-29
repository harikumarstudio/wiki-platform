const { parseGitLog } = require('../generate-article-dates')

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
