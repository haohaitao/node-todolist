const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use('/api', createProxyMiddleware({
    target: 'https://www.xxx.com',
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      "^/api": "/"
    },
  }));
};