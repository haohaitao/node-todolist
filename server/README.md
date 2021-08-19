<!--
 * @Description  : 
 * @Author       : pacino
 * @Date         : 2021-07-22 11:24:16
 * @LastEditTime : 2021-08-19 16:14:29
 * @LastEditors  : pacino
-->


# 需求说明，API说明

1.根据客户端传递过来的不同参数（状态/页码）查询任务列表
2.实现新增任务的功能（名称/截止日期/内容）
3.实现一个编辑的功能：根据客户端传递的任务对象进行编辑
    （名称/截止日期/内容/ID）
4.删除一个任务，根据ID
5.修改任务的状态（ID/状态---待办/完成）

# 安装依赖
  + npm i or yarn 
# API实现，在db文件夹执行
  - 启动mysql服务，创建一个数据库，等下config文件要用
  - 初始化使用 `sequelize cli` 数据库配置信息
    + npx sequelize init
  - 生成模型文件（migrate 文件、model 文件）
    + `npx sequelize model:generate --name Todo --attributes name:string,deadline:date,content:string,status:integer`
  - 持久化，模型对应的[数据库表]
    + npx sequelize db:migrate
  - sequelize默认会返回 ``` createAt和updateAt ``` 这两个字段
     在models文件夹中添加 timestamps 字段就可以不返回这两个字段
     ```
      {
          timestamps: false,
          sequelize,
          modelName: 'Todo',
      });
    ```
# 运行
- yarn
- yarn start
