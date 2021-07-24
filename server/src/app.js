/*
 * @Description  :
 * @Author       : pacino
 * @Date         : 2021-07-22 14:00:47
 * @LastEditTime : 2021-07-23 16:31:12
 * @LastEditors  : pacino
 */
const express = require("express");
const app = express();
// const bodyParser = require("body-parser");

const models = require("../db/models");
const moment = require("moment");
// 处理json
app.use(express.json());
// 对url参数做解码
app.use(express.urlencoded());
// duibody参数做解码
// app.use(bodyParser.urlencoded({ extends: true }));
app.use(express.urlencoded({ extended: false }));

// 1.所有的错误，http status = 500
// 查询任务列表
// app.get("/list/:status/:page", async (req, res, next) => {
//   //   next(new Error("自定义异常"));
//   res.json({
//     list: [],
//   });
// });

// 创建一个todo
app.post("/create", async (req, res, next) => {
  const { name, deadline, content } = req.body;
  //   数据持久化到数据库
  try {
    const todo = await models.Todo.create({
      name,
      deadline,
      content,
    });
    res.json({
      todo,
      message: "任务创建成功",
    });
  } catch (error) {
    next(error);
  }
});

// 修改一个todo
app.post("/update", async (req, res, next) => {
  try {
    const { name, deadline, content, id, status } = req.body;
    let todo = await models.Todo.findOne({
      where: {
        id,
      },
    });
    if (todo) {
      // 执行更新功能
      todo = await todo.update({
        name,
        deadline,
        content,
        status,
      });
    }
    res.json({
      todo,
    });
  } catch (error) {
    next(error);
  }
});

// 修改一个todo状态，删除
app.post("/update_status", async (req, res, next) => {
  try {
    const { id, status } = req.body;
    let todo = await models.Todo.findOne({
      where: {
        id,
      },
    });
    if (todo && status != todo.status) {
      // 执行更新
      todo = await todo.update({
        status,
      });
    }
    res.json({
      todo,
    });
  } catch (error) {
    next(error);
  }
});

// 查询任务列表
app.get("/list/:status/:page", async (req, res, next) => {
  let { status, page } = req.params;
  let limit = 5;
  let offset = (page - 1) * limit;
  let where = {};
  if (status != -1) {
    where.status = status;
  }
  // status 1.表示待办 2.表示完成 3.删除
  // 2.分页的处理
  let list = await models.Todo.findAndCountAll({
    where,
    offset,
    limit,
  });
  res.json({
    list,
    message: "列表查询成功",
  });
});

app.use((err, req, res, next) => {
  console.log("req---", req);
  if (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.listen(3001, () => {
  console.log("服务启动成功~");
});
