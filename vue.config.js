// const proxy = require('http-proxy-middleware');
module.exports = {
  // devServer: {
  //   proxy: "http://localhost:5000",
  // },
  // devServer: {
  //   // https: true,
  //   // disableHostCheck: true
  // },
  devServer: {
    port: 5000,
    // https: true,
    disableHostCheck: true,
    proxy: {
      // "/api": {
      //   target: "http://10.20.1.57:8000/",
      //   ws: true,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "^/api": "/",
      //   },
      // },
      // "/govd": {
      //   target: "http://10.20.1.57:8000/",
      //   ws: true,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "^/govd": "/",
      //   },
      // },
      // "/nssi_topology/govd": {
      //   target: "http://10.20.1.57:8000/",
      //   ws: true,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "^/nssi_topology/govd": "/",
      //   },
      // },
      "/fido": {
        target: "https://zero-trust-test.nutc-imac.com/",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/fido": "",
        },
      },
    },
    https: true,
  },
};
