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
  Popconfirm,
  Tag,
} from 'antd';
import { SearchOutlined, UserAddOutlined, DeleteOutlined } from '@ant-design/icons';
import { register, getUserNameById, getClasses, getAllUsers, deleteUser } from '../api/services';
import type { RegisterRequest, Class, User } from '../api/types';
import dayjs from 'dayjs';

export default function UserManagement() {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadClasses();
    loadUsers();
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
      loadUsers();
    } catch (error: any) {
      message.error(error.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error: any) {
      message.error(error.message || '加载用户列表失败');
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

  const handleDelete = async (userId: string) => {
    setLoading(true);
    try {
      await deleteUser({ userId });
      message.success('删除用户成功');
      loadUsers();
    } catch (error: any) {
      message.error(error.message || '删除用户失败');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    const roleMap: Record<string, string> = {
      学生: 'blue',
      班长: 'green',
      学习委员: 'orange',
    };
    return roleMap[role] || 'default';
  };

  const columns = [
    {
      title: '学号',
      dataIndex: 'user_id',
      key: 'user_id',
      width: 150,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role: string) => (
        <Tag color={getRoleColor(role)}>{role}</Tag>
      ),
    },
    {
      title: '班级ID',
      dataIndex: 'class_id',
      key: 'class_id',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '正常' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: 180,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: User) => (
        <Popconfirm
          title="确定要删除这个用户吗？"
          onConfirm={() => handleDelete(record.user_id)}
          okText="确定"
          cancelText="取消"
        >
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            loading={loading}
          >
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

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
                  ))}ß
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

        <Card title="用户列表" style={{ marginTop: 24 }}>
          <Table
            columns={columns}
            dataSource={users}
            rowKey="user_id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
            scroll={{ x: 1400 }}
          />
        </Card>
      </Card>
    </div>
  );
}

