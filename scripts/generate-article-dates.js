const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')
const { defaultPathToContent, mainSections } = require('../config/constants')

function parseGitLog(log) {
  const dates = {}
  let commitDate = null

  log.split(/\r?\n/).forEach((line) => {
    const commit = line.match(/^COMMIT:(.+)$/)

    if (commit) {
      commitDate = commit[1]
      return
    }

    const contentPath = line.replaceAll('\\', '/')
    if (!commitDate || !contentPath.endsWith('.md')) {
      return
    }

    const articleDates = dates[contentPath] || {
      createdAt: commitDate,
      updatedAt: commitDate,
    }
    articleDates.createdAt = commitDate
    dates[contentPath] = articleDates
  })

  return dates
}

function generateArticleDates(contentPath = path.resolve(defaultPathToContent), sections = mainSections) {
  const log = execFileSync('git', ['-C', contentPath, 'log', '--format=COMMIT:%cI', '--name-only', '--', ...sections], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  })
  const dates = parseGitLog(log)
  const outputPath = path.join(contentPath, '.article-dates.json')

  fs.writeFileSync(outputPath, `${JSON.stringify(dates)}\n`)
  console.log(`Generated Git dates for ${Object.keys(dates).length} content files.`)
}

if (require.main === module) {
  generateArticleDates()
}

module.exports = { generateArticleDates, parseGitLog }
