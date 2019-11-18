const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const config = require('./webpack.dev.config');


let port = process.env.PORT || 11000;

let server = new WebpackDevServer(
  webpack(config),
  {
    historyApiFallback: true,
    hot: true,
    publicPath: config.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  }
);

server.listen(port, 'localhost', error => {
  if (error)
    console.error(error);
  else
    console.info("==> Listening at http://localhost:%s/", port);
});
