// const proxy = require('http-proxy-middleware');
module.exports = {
    // devServer: {
    //   https: false,
    // }
    devServer: {
      port: 8080,
      disableHostCheck: true,
    proxy: {
        "/nssi_topology/govd": {
        target: "http://10.20.1.43:8000/",
        // ws: true,
        // changeOrigin: true,
        pathRewrite: {
          "^/nssi_topology/govd": "/",
        },
      },
        "/nssi_topology/api": {
        target: "http://10.20.1.43:8000/",
        // ws: true,
        // changeOrigin: true,
        pathRewrite: {
          "^/nssi_topology/api": "/",
        },
      },
        "/api": {
          target: 'http://10.20.1.43:8000/',
          // ws: true,
          // changeOrigin: true,
          pathRewrite: {
            '^/api': '/'
          }
        },
        "/govd": {
          target: 'http://10.20.1.43:8000/',
          // ws: true,
          // changeOrigin: true,
          pathRewrite: {
            '^/govd': '/', 
          }
        }
      }
    }
}
