const fs = require('fs')
const path = require('path')
const { defaultPathToContent } = require('../../config/constants')

const articleDates = new Map()

function getArticleDates(doc) {
  const articlePath = doc.filePathStem.replace(/^\/+/, '').replace(/\/index$/, '')
  const articleDatesPath = path.resolve(defaultPathToContent, articlePath, 'article-date.json')

  if (!articleDates.has(articleDatesPath)) {
    const dates = fs.existsSync(articleDatesPath) ? JSON.parse(fs.readFileSync(articleDatesPath, 'utf8')) : undefined
    articleDates.set(articleDatesPath, dates)
  }

  return articleDates.get(articleDatesPath)
}

module.exports = getArticleDates
