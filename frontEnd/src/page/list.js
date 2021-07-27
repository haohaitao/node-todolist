/*
 * @Description  : 使用hooks写list组件
 * @Author       : pacino
 * @Date         : 2021-07-27 10:34:59
 * @LastEditTime : 2021-07-27 17:56:12
 * @LastEditors  : pacino
 */

import React, { useState, useEffect } from "react";
import "../css/list.css";
import {
  Divider,
  Table,
  Button,
  Space,
  Form,
  Col,
  Row,
  Input,
  DatePicker,
  Drawer,
  Select,
  message,
  Popconfirm,
} from "antd";
import request from "../utils/request";
import moment from "moment";
const { Option } = Select;
function List() {
  // const formRef = React.createRef();
  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
      width: 100,
      align: "center",
    },
    {
      title: "标题",
      dataIndex: "name",
      key: "name",
      width: 100,
      align: "center",
    },
    {
      title: "内容",
      dataIndex: "content",
      key: "content",
      width: 300,
      align: "center",
    },
    {
      title: "截止日期",
      dataIndex: "deadline",
      key: "deadline",
      width: 150,
      align: "center",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 300,
      align: "center",
      render: (text, record) =>
        record.status === 1 ? "待办" : record.status === 2 ? "完成" : "已删除",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => editHander(record)}>编辑</Button>
          {record.status !== 3 && record.status !== 2 ? (
            <div>
              <Button type="primary" ghost onClick={() => changeStatus(record)}>
                完成
              </Button>
              <Popconfirm
                title="你确定要删除吗?"
                onConfirm={() => this.delHandel(record)}
                okText="确定"
                cancelText="取消"
              >
                <Button danger className="delete-line">
                  删除
                </Button>
              </Popconfirm>
            </div>
          ) : null}
        </Space>
      ),
      filters: [
        {
          text: "全部",
          value: -1,
        },
        {
          text: "代办",
          value: 1,
        },
        {
          text: "完成",
          value: 2,
        },
        {
          text: "删除",
          value: 3,
        },
      ],
      filterMultiple: false,
      onFilter: (value, record) => value === record.status,
    },
  ];
  const pageSize = 5;
  const [formRef] = useState(React.createRef());
  const [page, setPage] = useState(1); // 更新页码
  const [listData, setList] = useState([]); // 存列表数据
  const [total, setTotal] = useState(0);
  const [type, setType] = useState("add");
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState({});
  const [saveStatus, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function listInit() {
      setIsLoading(true);
      const result = await request.get("/api/list/-1/" + page);
      result.data.list.rows.forEach((ele, i) => {
        ele.key = i;
      });
      const items = result.data.list.rows;
      items.forEach((ele) => {
        ele.deadline = ele.deadline?.split("T")[0];
      });
      setItems(items);
      setList(items);
      setTotal(result.data.list.count);
      setIsLoading(false);
    }
    listInit();
  }, [page]);

  // 新增表单
  function addHandel() {
    setVisible(true);
    setType("add");
    formRef.current?.resetFields();
  }
  // 重置表单
  function onReset() {
    formRef.current?.resetFields();
  }

  // 关闭弹出层
  function onClose() {
    setVisible(false);
  }

  // 选择当前状态
  function selectStatus(type) {
    setStatus(type);
  }

  // 不可选择的日期
  function disabledDate(current) {
    return current && current < moment().subtract(1, "days").endOf("day");
  }

  // 修改数据
  function editHander(item) {
    setVisible(true);
    setType("update");
    setItems(item);
    // 重新赋值
    setTimeout(() => {
      formRef.current?.setFieldsValue({
        name: item.name,
        content: item.content,
        deadline: moment(item.deadline),
        status:
          item.status === 2
            ? "已完成"
            : item.status === 1
            ? "待完成"
            : "已删除",
      });
    });
  }

  // 更改状态, 根据demo来
  async function changeStatus(item) {
    setIsLoading(true);
    try {
      if (item.status === 3) {
        item.status = 1; // 从删除变成代办
        await request.post("/api/update_status", item);
        getList("-1");
        message.success("状态变更代办成功");
        setIsLoading(false);
      } else if (item.status === 1) {
        item.status = 2; // 从代办变成完成
        await request.post("/api/update_status", item);
        getList("-1");
        message.success("状态变更完成");
        setIsLoading(false);
      }
    } catch (err) {
      message.error(err);
      setIsLoading(false);
    }
  }

  // 封装列表接口
  async function getList() {
    setIsLoading(true);
    const result = await request.get("/api/list/-1/" + page);
    result.data.list.rows.forEach((ele, i) => {
      ele.key = i;
    });
    const items = result.data.list.rows;
    items.forEach((ele) => {
      ele.deadline = ele.deadline?.split("T")[0];
    });
    setItems(items);
    setList(items);
    setTotal(result.data.list.count);
    setIsLoading(false);
  }

  // 提交表单
  async function onFinish(itemInfo) {
    itemInfo.deadline = moment(itemInfo.deadline).format("YYYY-MM-DD");
    setIsLoading(true);
    try {
      if (type === "add") {
        // 调用新增接口
        itemInfo.status = 1; // 默认是1
        const data = await request.post("/api/create", itemInfo);
        message.success("任务新增完成");
        if (data.status === 200) {
          const changePage = Math.ceil(total / pageSize);
          setPage(changePage);
          getList("-1");
        }
      } else {
        // 调用修改接口
        itemInfo.status = saveStatus ? saveStatus : items.status;
        itemInfo.id = items.id;
        const data = await request.post("/api/update", itemInfo);
        if (data.status === 200) {
          message.success("任务修改完成");
          getList("-1");
        }
      }
      setVisible(false);
      setIsLoading(false);
    } catch (err) {
      message.error(err);
      setIsLoading(false);
    }
  }
  return (
    <div className="wrapper" key={1}>
      <div className="header">
        <h1>导航</h1>
        <span onClick={() => this.props.history.goBack()}>返回首页</span>
      </div>
      <div className="divide">
        <Divider>任务列表</Divider>
      </div>
      <div className="box">
        <Button type="primary" onClick={() => addHandel()}>
          新增
        </Button>
        <div className="table">
          <Table
            loading={isLoading}
            columns={columns}
            dataSource={listData}
            pagination={{
              showQuickJumper: false,
              showTotal: () => `共${total}条`,
              pageSize: pageSize,
              total: total, //数据的总的条数
              onChange: (current) => setPage(current), //点击当前页码
            }}
          />
        </div>
      </div>
      <Drawer
        title={type === "update" ? "修改任务" : "新增任务"}
        width={500}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <Form
          layout="vertical"
          ref={formRef}
          onFinish={(event) => onFinish(event)}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="任务名称:"
                rules={[
                  {
                    required: true,
                    message: "请输入任务名称",
                  },
                ]}
              >
                <Input placeholder="请输入任务名称" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="deadline"
                label="任务截止日期:"
                rules={[{ required: true, message: "请选择任务截止日期" }]}
              >
                <DatePicker
                  className="dateStyle"
                  autoFocus={true}
                  disabledDate={(current) => disabledDate(current)}
                />
              </Form.Item>
            </Col>
          </Row>
          {type === "update" && items.status === 2 && (
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="status"
                  label="修改状态:"
                  rules={[{ required: false }]}
                >
                  <Select
                    placeholder="请选择状态"
                    onChange={(value) => selectStatus(value)}
                    allowClear
                  >
                    <Option value="1">待办</Option>
                    <Option value="3">删除</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          )}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="content"
                label="任务内容:"
                rules={[{ required: false }]}
              >
                <Input.TextArea placeholder="请填写内容" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Col>
            <Col span={8}>
              <Button onClick={() => onReset()}>重置</Button>{" "}
            </Col>
            <Col span={8}>
              <Button type="primary" danger onClick={() => onClose()}>
                取消
              </Button>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
}
export default List;
