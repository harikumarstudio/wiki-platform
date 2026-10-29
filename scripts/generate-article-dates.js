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

function removeArticleDateFiles(directory) {
  if (!fs.existsSync(directory)) {
    return
  }

  fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      removeArticleDateFiles(entryPath)
    } else if (entry.isFile() && entry.name === 'article-date.json') {
      fs.unlinkSync(entryPath)
    }
  })
}

function writeArticleDates(dates, contentPath, sections = mainSections) {
  sections.forEach((section) => removeArticleDateFiles(path.join(contentPath, section)))

  let articleCount = 0

  Object.entries(dates).forEach(([markdownPath, articleDates]) => {
    if (path.posix.basename(markdownPath) !== 'index.md') {
      return
    }

    const articleIndexPath = path.join(contentPath, markdownPath)
    if (!fs.existsSync(articleIndexPath)) {
      return
    }

    const outputPath = path.join(path.dirname(articleIndexPath), 'article-date.json')
    fs.writeFileSync(outputPath, `${JSON.stringify(articleDates)}\n`)
    articleCount++
  })

  return articleCount
}

function generateArticleDates(contentPath = path.resolve(defaultPathToContent), sections = mainSections) {
  const log = execFileSync('git', ['-C', contentPath, 'log', '--format=COMMIT:%cI', '--name-only', '--', ...sections], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  })
  const dates = parseGitLog(log)
  const articleCount = writeArticleDates(dates, contentPath, sections)

  console.log(`Generated Git dates for ${articleCount} articles.`)
}

if (require.main === module) {
  generateArticleDates()
}

module.exports = { generateArticleDates, parseGitLog, writeArticleDates }
