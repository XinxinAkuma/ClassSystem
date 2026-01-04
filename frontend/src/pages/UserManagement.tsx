import { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Table,
  Space,
  message,
  Modal,
  Select,
} from 'antd';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import { register, getUserNameById, getClasses } from '../api/services';
import type { RegisterRequest, Class } from '../api/types';

export default function UserManagement() {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const data = await getClasses();
      setClasses(data);
    } catch (error) {
      message.error('加载班级列表失败');
    }
  };

  const handleRegister = async (values: RegisterRequest) => {
    setLoading(true);
    try {
      await register(values);
      message.success('用户注册成功');
      form.resetFields();
      setModalVisible(false);
    } catch (error: any) {
      message.error(error.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (values: { userId: string }) => {
    if (!values.userId) {
      message.warning('请输入用户ID');
      return;
    }
    setLoading(true);
    try {
      const name = await getUserNameById({ userId: values.userId });
      setUserName(name);
      message.success('查询成功');
    } catch (error: any) {
      message.error(error.message || '查询失败');
      setUserName('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card>
        <h1 style={{ marginBottom: 24 }}>用户管理</h1>

        <Card
          title="查询用户名"
          style={{ marginBottom: 24 }}
          extra={<SearchOutlined />}
        >
          <Form form={searchForm} layout="inline" onFinish={handleSearch}>
            <Form.Item name="userId" label="用户ID" rules={[{ required: true }]}>
              <Input placeholder="请输入用户ID" style={{ width: 200 }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                查询
              </Button>
            </Form.Item>
            {userName && (
              <Form.Item label="用户名">
                <span style={{ fontSize: 16, fontWeight: 'bold', color: '#1890ff' }}>
                  {userName}
                </span>
              </Form.Item>
            )}
          </Form>
        </Card>

        <Card
          title="用户注册"
          extra={
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setModalVisible(true)}
            >
              注册新用户
            </Button>
          }
        >
          <Modal
            title="用户注册"
            open={modalVisible}
            onCancel={() => {
              setModalVisible(false);
              form.resetFields();
            }}
            footer={null}
            width={600}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleRegister}
              style={{ marginTop: 24 }}
            >
              <Form.Item
                name="user_id"
                label="学号"
                rules={[{ required: true, message: '请输入学号' }]}
              >
                <Input placeholder="请输入学号" />
              </Form.Item>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder="请输入姓名" />
              </Form.Item>
              <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password placeholder="请输入密码" />
              </Form.Item>
              <Form.Item
                name="phone"
                label="手机号"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
                ]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入正确的邮箱格式' },
                ]}
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>
              <Form.Item
                name="role"
                label="角色"
                rules={[{ required: true, message: '请选择角色' }]}
              >
                <Select placeholder="请选择角色">
                  <Select.Option value="学生">普通学生</Select.Option>
                  <Select.Option value="班长">班长</Select.Option>
                  <Select.Option value="学习委员">学习委员</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="class_id"
                label="班级"
                rules={[{ required: true, message: '请选择班级' }]}
              >
                <Select placeholder="请选择班级" showSearch>
                  {classes.map((cls) => (
                    <Select.Option key={cls.class_id} value={cls.class_name}>
                      {cls.class_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    注册
                  </Button>
                  <Button
                    onClick={() => {
                      setModalVisible(false);
                      form.resetFields();
                    }}
                  >
                    取消
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </Card>
      </Card>
    </div>
  );
}

