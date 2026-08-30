// Flat-конфиг вместо .eslintrc.json и .eslintignore: eslint 10 поддерживает
// только этот формат, старый удалён из ядра.
const js = require('@eslint/js')
const globals = require('globals')
const prettierRecommended = require('eslint-plugin-prettier/recommended')
const jest = require('eslint-plugin-jest')

module.exports = [
  {
    // Moved from .eslintignore. Content sections are included via symlinks and
    // contain demos with their own code — there is no need to lint third-party files.
    ignores: [
      'node_modules/**',
      'dist/**',
      'bin/**',
      'src/html/**',
      'src/css/**',
      'src/js/**',
      'src/tools/**',
      'src/recipes/**',
      'src/a11y/**',
      'src/pages/**',
      'src/people/**',
      'src/specials/**',
      'src/interviews/**',
    ],
  },

  js.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      semi: ['warn', 'never'],
    },
  },

  // Jest rules are only included in tests: previously, plugin:jest/recommended
  // would hang throughout the entire project, even though it doesn't check anything outside of __tests__.
  {
    files: ['**/__tests__/**/*.js'],
    ...jest.configs['flat/recommended'],
  },

  // Comes last: Disables formatting rules that conflict with prettier,
  // and typically includes Prettier itself.
  prettierRecommended,
]
