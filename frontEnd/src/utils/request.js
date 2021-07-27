/*
 * @Description  :
 * @Author       : pacino
 * @Date         : 2021-07-27 09:37:38
 * @LastEditTime : 2021-07-27 17:55:37
 * @LastEditors  : pacino
 */
import axios from "axios";
import { Modal } from "antd";
// 根据环境不同引入不同api地址
// create an axios instance
const service = axios.create({
  // baseURL: '', // url = base api url + request url
  // withCredentials: true // send cookies when cross-domain requests
});

// request拦截器 request interceptor
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    // do something with request error
    console.log("---err0r1111----", error);
    Modal.info({
      title: "提示",
      content: (
        <div>
          <p>系统出现异常，请稍后重试</p>
        </div>
      ),
      onOk() {
        return Promise.reject(error);
      },
    });
  }
);
// respone拦截器
service.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  (error) => {
    console.log("---err0r2222----", error);
    Modal.error({
      title: "提示",
      content: "系统出现异常，请稍后重试",
    });
    return Promise.reject(error);
  }
);

export default service;
