const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use('/api', proxy({
    target: "",
    secure: false,
    changeOrigin: true,
    pathRewrite: {
      "^/api": "/"
    },
    // cookieDomainRewrite: "http://localhost:3000"
  }));
};