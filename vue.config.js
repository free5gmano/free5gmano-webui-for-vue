// const proxy = require('http-proxy-middleware');
module.exports = {
    // devServer: {
    //   https: false,
    // }
    devServer: {
      proxy:{
        "/api": {
          target: 'http://10.20.1.40/',
          ws: true,
          changeOrigin: true,
          pathRewrite: {
            '^/api': '/' 
          }
        },
        "/govd": {
          target: 'http://10.20.1.40:80/',
          ws: true,
          changeOrigin: true,
          pathRewrite: {
            '^/govd': '/' 
          }
        }
      }
    }
}