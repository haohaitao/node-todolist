/*
 * @Description  : 
 * @Author       : pacino
 * @Date         : 2021-07-27 09:37:38
 * @LastEditTime : 2021-07-27 11:04:41
 * @LastEditors  : pacino
 */
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://nodejs.haoht123.com",
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        "^/api": "/",
      },
    })
  );
};
