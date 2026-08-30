module.exports = {
  title: 'All Articles',
  // Without a layout, sc-all.njk is already a complete document, just like sc.njk and
  // sc-index.njk. Wrapping it in base.njk resulted in the page being nested
  // within itself, with two doctypes and two body tags.
  permalink: '/all/index.sc.html',
}
