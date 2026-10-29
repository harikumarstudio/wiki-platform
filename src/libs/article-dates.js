const fs = require('fs')
const path = require('path')
const { defaultPathToContent } = require('../../config/constants')

const articleDatesPath = path.resolve(defaultPathToContent, '.article-dates.json')
let articleDates

function getArticleDates(doc) {
  if (articleDates === undefined) {
    articleDates = fs.existsSync(articleDatesPath) ? JSON.parse(fs.readFileSync(articleDatesPath, 'utf8')) : {}
  }

  const contentPath = `${doc.filePathStem.replace(/^\/+/, '')}.md`
  return articleDates[contentPath]
}

module.exports = getArticleDates
