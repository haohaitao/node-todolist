import React, { Component } from "react";
import "../css/list.css";
import moment from "moment";
import axios from "axios";
import {
  Divider,
  Table,
  Button,
  Space,
  message,
  Form,
  Col,
  Row,
  Input,
  DatePicker,
  Drawer,
  Select,
  Popconfirm,
} from "antd";
const { Option } = Select;
export default class List extends Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.queryData = this.queryData.bind(this);
    this.state = {
      columns: [
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
            record.status === 1
              ? "待办"
              : record.status === 2
              ? "完成"
              : "已删除",
        },
        {
          title: "Action",
          key: "action",
          render: (text, record) => (
            <Space size="middle">
              <Button onClick={() => this.editHander(record)}>编辑</Button>
              {record.status !== 3 && record.status !== 2 ? (
                <div>
                  <Button
                    type="primary"
                    ghost
                    onClick={() => this.changeStatus(record)}
                  >
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
      ],
      visible: false,
      listData: [],
      pageSize: 5,
      total: 0,
      page: 1,
      type: "add",
      items: {},
    };
  }
  componentDidMount() {
    // 组件已挂载, 可进行状态更新操作
    this.queryData("-1"); // 查询所有
  }
  // 重置表单
  onReset() {
    this.formRef.current.resetFields();
  }
  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  // 新增表单
  addHandel = () => {
    this.setState(
      {
        visible: true,
        type: "add",
      },
      () => {
        this.formRef.current.resetFields();
      }
    );
  };
  // 更改状态, 根据demo来
  changeStatus = (item) => {
    if (item.status === 3) {
      item.status = 1; // 从删除变成代办
      axios.post("/update_status", item).then((response) => {
        this.queryData("-1");
        message.success("状态变更代办成功");
      });
    } else if (item.status === 1) {
      item.status = 2; // 从代办变成完成
      axios.post("/update_status", item).then((response) => {
        this.queryData("-1");
        message.success("状态变更完成");
      });
    }
  };
  // 删除数据
  delHandel = (item) => {
    message.success("任务删除成功");
    item.status = "3"; // 全部改成删除装填
    axios.post("/update_status", item).then((response) => {
      this.queryData("-1");
    });
  };
  // 修改数据
  editHander(item) {
    this.setState({
      visible: true,
      type: "update",
      items: item,
    });
    // 重新赋值
    setTimeout(() => {
      this.formRef.current.setFieldsValue({
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
  // 提交表单
  onFinish(itemInfo) {
    itemInfo.deadline = moment(itemInfo.deadline).format("YYYY-MM-DD");
    const { type, saveStatus, items } = this.state;
    if (type === "add") {
      // 调用新增接口
      itemInfo.status = 1; // 默认是1
      axios.post("/create", itemInfo).then((response) => {
        message.success("任务新增完成");
        this.queryData("-1");
        this.setState({
          visible: false,
        });
      });
    } else {
      // 调用修改接口
      itemInfo.status = saveStatus ? saveStatus : items.status;
      itemInfo.id = items.id;
      axios.post("/update", itemInfo).then((response) => {
        message.success("任务修改完成");
        this.queryData("-1");
        this.setState({
          visible: false,
        });
      });
    }
  }

  // 查询所有列表
  queryData(item) {
    axios.get("/list/" + item + "/" + this.state.page).then((response) => {
      response.data.list.rows.forEach((ele, i) => {
        ele.key = i;
      });
      var items = response.data.list.rows;
      items.forEach((ele) => {
        ele.deadline = ele.deadline?.split("T")[0];
      });
      this.setState({
        listData: items,
        total: response.data.list.count,
      });
    });
  }

  pageChange(page) {
    this.setState(
      {
        page,
      },
      () => {
        this.queryData("-1");
      }
    );
  }

  // 选择当前状态
  selectStatus(type) {
    console.log("--type--", type);
    this.setState({
      saveStatus: type,
    });
  }

  // 不可选择的日期
  disabledDate(current) {
    return current && current < moment().subtract(1, "days").endOf("day");
  }
  render() {
    const { columns, total, pageSize, listData, type, visible, items } =
      this.state;
    return (
      <div className="wrapper" key={1}>
        <div className="header">
          <h1>导航</h1>
          <a href="/home">返回首页</a>
        </div>
        <div className="divide">
          <Divider>任务列表</Divider>
        </div>
        <div className="box">
          <Button type="primary" onClick={this.addHandel}>
            新增
          </Button>
          <div className="table">
            <Table
              columns={columns}
              dataSource={listData}
              pagination={{
                showQuickJumper: false,
                showTotal: () => `共${total}条`,
                pageSize: pageSize,
                total: total, //数据的总的条数
                onChange: (current) => this.pageChange(current), //点击当前页码
              }}
            />
          </div>
        </div>
        <Drawer
          title={type === "update" ? "修改任务" : "新增任务"}
          width={500}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={visible}
        >
          <Form
            layout="vertical"
            ref={this.formRef}
            onFinish={(event) => this.onFinish(event)}
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
                    disabledDate={(current) => this.disabledDate(current)}
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
                      onChange={(value) => this.selectStatus(value)}
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
                <Button onClick={() => this.onReset()}>重置</Button>{" "}
              </Col>
              <Col span={8}>
                <Button type="primary" danger onClick={this.onClose}>
                  取消
                </Button>
              </Col>
            </Row>
          </Form>
        </Drawer>
      </div>
    );
  }
}
