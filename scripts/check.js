#!/usr/bin/env node

// Run all fast checks: tests and linters.
//
// Unlike `npm run lint-check`, these checks do not stop one another.
// lint-check chains steps with `&&`: if editorconfig fails, stylelint and
// eslint never run, and the output shows line-ending errors instead of actual
// code issues. Here every check runs to completion and the results are
// summarized in a table, as they are in CI with `if: !cancelled()`.
//
// Markup validation is not included: `lint:html` requires a built `dist` and
// Java, so it is not part of the fast cycle. Run it separately after
// `npm run build`.

'use strict'

const { spawnSync } = require('child_process')

const CHECKS = [
  ['Tests', ['test']],
  ['editorconfig', ['run', 'editorconfig']],
  ['CSS linter', ['run', 'lint:css']],
  ['JavaScript linter', ['run', 'lint:js']],
]

const results = []

for (const [name, args] of CHECKS) {
  console.log(`\n──── ${name} ────`)
  const { status } = spawnSync('npm', args, { stdio: 'inherit', shell: process.platform === 'win32' })
  results.push([name, status === 0])
}

console.log('\n──── Summary ────')
for (const [name, ok] of results) {
  console.log(`${ok ? '✓' : '✗'} ${name}`)
}

const failed = results.filter(([, ok]) => !ok)

if (failed.length > 0) {
  console.error(`\nFailed checks: ${failed.length} of ${results.length}.`)
  process.exitCode = 1
} else {
  console.log('\nAll checks passed.')
}
