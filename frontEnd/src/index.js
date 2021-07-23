/*
 * @Description  :
 * @Author       : pacino
 * @Date         : 2021-07-23 11:07:11
 * @LastEditTime : 2021-07-23 15:23:49
 * @LastEditors  : pacino
 */
import React from "react";
import ReactDOM from "react-dom";
import Router from "../src/route/router";
import reportWebVitals from "./reportWebVitals";
import zhCN from "antd/es/locale/zh_CN";
import { ConfigProvider } from "antd";

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <React.StrictMode>
      <Router />,
    </React.StrictMode>
  </ConfigProvider>,
  document.getElementById("root")
);

reportWebVitals();
