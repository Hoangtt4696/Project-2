module.exports = {
  output: {
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.js'],
    modules: [
      'node_modules',
    ],
  },
  node: {
    fs: 'empty',
  },
  module: {
    loaders: [],
  },
};
