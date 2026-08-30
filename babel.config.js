// Project-level config instead of .babelrc: the latter applies only to files
// within the package and does not affect node_modules. This is important for Jest —
// jsdom 30 pulls in the ESM package @exodus/bytes, which needs to be transformed.
module.exports = {
  presets: ['@babel/preset-env'],
}
