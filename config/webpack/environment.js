const { environment } = require('@rails/webpacker')

const renderFileLoader = {
  test: /\.render\.js$/,
  use: ['file-loader']
};

environment.loaders.append('render.js', renderFileLoader)

module.exports = environment;
