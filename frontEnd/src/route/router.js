/*
 * @Description  :
 * @Author       : pacino
 * @Date         : 2021-07-23 17:12:46
 * @LastEditTime : 2021-07-27 17:56:24
 * @LastEditors  : pacino
 */
import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import Home from "../page/home";
import List from "../page/list";

// 配置路由
const BasicRoute = () => (
  <HashRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/list" component={List} />
    </Switch>
  </HashRouter>
);

export default BasicRoute;
