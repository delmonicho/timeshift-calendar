const path = require('path');

module.exports = {
  outputDir: path.resolve(__dirname, '../timeshift-server/public'),
  devServer: {
    proxy: {
      '/': {
        target: 'http://localhost:3000'
      }
    }
  }
}
