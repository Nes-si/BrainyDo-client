const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const path = require('path');

const config = require('./webpack.dev.config');


let port = process.env.PORT || 11000;

let server = new WebpackDevServer(
  webpack(config),
  {
    contentBase: path.join(__dirname, '../static/'),
    historyApiFallback: true,
    hot: true,
    publicPath: config.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  }
);

server.listen(port, 'localhost');
