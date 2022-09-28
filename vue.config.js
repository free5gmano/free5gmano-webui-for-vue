// const proxy = require('http-proxy-middleware');
module.exports = {
    // devServer: {
    //   https: false,
    // }
    devServer: {
      proxy:{
        "/api": {
          target: 'http://10.20.1.57:8000/',
          ws: true,
          changeOrigin: true,
          pathRewrite: {
            '^/api': '/'
          }
        },
        "/govd": {
          target: 'http://10.20.1.57:8000/',
          ws: true,
          changeOrigin: true,
          pathRewrite: {
            '^/govd': '/', 
          }
        },
        "/nssi_topology/govd": {
          target: 'http://10.20.1.57:8000/',
          ws: true,
          changeOrigin: true,
          pathRewrite: {
            '^/nssi_topology/govd': '/' 
          }
        }
      }
    }
}