module.exports = {
  testEnvironment: 'jest-environment-node',
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  // linkedom and its dependencies are shipped as ESM, whereas Jest loads node_modules
  // as CommonJS fails on `import`. These packages are needed for transformation tests:
  // specifically through linkedom the build parses HTML.
  transformIgnorePatterns: [
    '/node_modules/(?!(linkedom|css-select|css-what|boolbase|domhandler|domutils|domelementtype' +
      '|nth-check|entities|htmlparser2|uhyphen|cssom|html-escaper|dom-serializer)/)',
  ],
}
