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
  Tag,
  Popconfirm,
} from 'antd';
import {
  FileTextOutlined,
  UserAddOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  signUpActivity,
  cancelSignUp,
  getActivities,
  getSignups,
  getUserNameById,
} from '../api/services';
import type { Activity, Signup, SignupRequest } from '../api/types';

type SignupWithMeta = Signup & {
  userName?: string;
  activityName?: string;
};

export default function SignupManagement() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [signups, setSignups] = useState<SignupWithMeta[]>([]);
  const [userNames, setUserNames] = useState<Record<string, string>>({});

  useEffect(() => {
    loadActivities();
    loadSignups();
  }, []);

  const loadActivities = async () => {
    try {
      const data = await getActivities();
      setActivities(data);
    } catch (error: any) {
      message.error(error.message || '加载活动列表失败');
    }
  };

  const hydrateUserNames = async (items: Signup[]) => {
    const ids = Array.from(new Set(items.map((item) => item.userId))).filter(
      (id) => !userNames[id],
    );
    if (!ids.length) return;

    try {
      const fetched = await Promise.all(
        ids.map(async (id) => {
          try {
            const name = await getUserNameById({ userId: id });
            return [id, name] as const;
          } catch (error) {
            return [id, '未知用户'] as const;
          }
        }),
      );

      const nameMap: Record<string, string> = {};
      fetched.forEach(([id, name]) => {
        nameMap[id] = name;
      });
      setUserNames((prev) => ({ ...prev, ...nameMap }));
    } catch (error: any) {
      message.error(error.message || '加载用户名失败');
    }
  };

  const loadSignups = async () => {
    setLoading(true);
    try {
      const data = await getSignups();
      const normalized = data.map((item) => ({
        ...item,
        // 后端可能用 activityID/userID，这里统一成 activityId/userId
        activityId: item.activityId ?? (item as any).activityID,
        userId: item.userId ?? (item as any).userID,
      }));
      setSignups(normalized);
      hydrateUserNames(normalized);
    } catch (error: any) {
      message.error(error.message || '加载报名列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (values: SignupRequest) => {
    setLoading(true);
    try {
      await signUpActivity(values);
      message.success('报名成功');
      form.resetFields();
      setModalVisible(false);
      loadSignups();
    } catch (error: any) {
      message.error(error.message || '报名失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSignUp = async (activityId: number, userId: string) => {
    setLoading(true);
    try {
      await cancelSignUp({ activityId, userId });
      message.success('取消报名成功');
      loadSignups();
    } catch (error: any) {
      message.error(error.message || '取消报名失败');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '报名ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '活动ID',
      dataIndex: 'activityId',
      key: 'activityId',
      width: 100,
    },
    {
      title: '活动名称',
      dataIndex: 'activityName',
      key: 'activityName',
      width: 200,
      render: (_: any, record: SignupWithMeta) => {
        const activity = activities.find(
          (item) => item.activityId === record.activityId,
        );
        return record.activityName || activity?.name || '—';
      },
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 150,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
      width: 150,
      render: (_: any, record: SignupWithMeta) =>
        record.userName || userNames[record.userId] || '—',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'signed' ? 'green' : 'default'}>
          {status === 'signed' ? '已报名' : status}
        </Tag>
      ),
    },
    {
      title: '报名时间',
      dataIndex: 'signupTime',
      key: 'signupTime',
      width: 180,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Popconfirm
          title="确定要取消报名吗？"
          onConfirm={() => handleCancelSignUp(record.activityId, record.userId)}
          okText="确定"
          cancelText="取消"
        >
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            loading={loading}
          >
            取消报名
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Space style={{ marginBottom: 24, justifyContent: 'space-between', width: '100%' }}>
          <Space>
            <FileTextOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            <h1 style={{ margin: 0 }}>报名管理</h1>
          </Space>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setModalVisible(true)}
          >
            新增报名
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={signups}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 1200 }}
        />

        <Modal
          title="新增报名"
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
            onFinish={handleSignUp}
            style={{ marginTop: 24 }}
          >
            <Form.Item
              name="activityId"
              label="选择活动"
              rules={[{ required: true, message: '请选择活动' }]}
            >
              <Select placeholder="请选择活动" showSearch>
                {activities.map((activity) => (
                  <Select.Option key={activity.activityId} value={activity.activityId}>
                    {activity.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="userId"
              label="用户ID"
              rules={[{ required: true, message: '请输入用户ID' }]}
            >
              <Input placeholder="请输入用户ID" />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  提交报名
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
    </div>
  );
}

