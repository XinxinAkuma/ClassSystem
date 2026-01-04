import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  message,
  Popconfirm,
  Tag,
} from 'antd';
import {
  CalendarOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getActivities, createActivity, deleteActivity, getClasses, changeActivityStatus } from '../api/services';
import type { Activity, CreateActivityRequest } from '../api/types';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

export default function ActivityManagement() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    loadActivities();
    loadClasses();
  }, []);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const data = await getActivities();
      setActivities(data);
    } catch (error: any) {
      message.error(error.message || '加载活动列表失败');
    } finally {
      setLoading(false);
    }
  };

  const loadClasses = async () => {
    try {
      const data = await getClasses();
      setClasses(data);
    } catch (error) {
      console.error('加载班级列表失败:', error);
    }
  };

  const handleCreate = async (values: any) => {
    setLoading(true);
    try {
      const activityData: CreateActivityRequest = {
        name: values.name,
        description: values.description || '',
        location: values.location,
        startTime: values.timeRange[0].toISOString(),
        endTime: values.timeRange[1].toISOString(),
        signupStart: values.signupRange[0].toISOString(),
        signupEnd: values.signupRange[1].toISOString(),
        leader_id: values.leader_id,
        budget: values.budget,
        status: values.status || 'pending',
        maxPeople: values.maxPeople,
      };
      await createActivity(activityData);
      message.success('活动创建成功');
      form.resetFields();
      setModalVisible(false);
      loadActivities();
    } catch (error: any) {
      message.error(error.message || '创建活动失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (activityId: number) => {
    setLoading(true);
    try {
      await deleteActivity({ activityId });
      message.success('活动删除成功');
      loadActivities();
    } catch (error: any) {
      message.error(error.message || '删除活动失败');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (activityId: number, newStatus: string) => {
    setLoading(true);
    try {
      await changeActivityStatus({ activityId, status: newStatus });
      message.success('活动状态更新成功');
      loadActivities();
    } catch (error: any) {
      message.error(error.message || '更新活动状态失败');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'orange',
      active: 'green',
      completed: 'blue',
      cancelled: 'red',
    };
    return statusMap[status] || 'default';
  };

  const columns = [
    {
      title: '活动ID',
      dataIndex: 'activityId',
      key: 'activityId',
      width: 100,
    },
    {
      title: '活动名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 250,
      ellipsis: true,
    },
    {
      title: '地点',
      dataIndex: 'location',
      key: 'location',
      width: 150,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 180,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 180,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '预算',
      dataIndex: 'budget',
      key: 'budget',
      width: 120,
      render: (budget: number) => `¥${budget.toFixed(2)}`,
    },
    {
      title: '最大人数',
      dataIndex: 'maxPeople',
      key: 'maxPeople',
      width: 100,
    },
    {
      title: '负责人ID',
      dataIndex: 'leaderId',
      key: 'leaderId',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: string, record: Activity) => {
        const statusMap: Record<string, string> = {
          pending: '待开始',
          active: '进行中',
          completed: '已完成',
          cancelled: '已取消',
        };
        return (
          <Select
            value={status}
            onChange={(value) => handleStatusChange(record.activityId, value)}
            style={{ width: 120 }}
            disabled={loading}
          >
            <Select.Option value="pending">待开始</Select.Option>
            <Select.Option value="active">进行中</Select.Option>
            <Select.Option value="completed">已完成</Select.Option>
            <Select.Option value="cancelled">已取消</Select.Option>
          </Select>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: Activity) => (
        <Popconfirm
          title="确定要删除这个活动吗？"
          onConfirm={() => handleDelete(record.activityId)}
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
        <Space style={{ marginBottom: 24, justifyContent: 'space-between', width: '100%' }}>
          <Space>
            <CalendarOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            <h1 style={{ margin: 0 }}>活动管理</h1>
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            创建活动
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={activities}
          rowKey="activityId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 1600 }}
        />

        <Modal
          title="创建活动"
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={700}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreate}
            style={{ marginTop: 24 }}
          >
            <Form.Item
              name="name"
              label="活动名称"
              rules={[{ required: true, message: '请输入活动名称' }]}
            >
              <Input placeholder="请输入活动名称" />
            </Form.Item>
            <Form.Item name="description" label="活动描述">
              <TextArea rows={4} placeholder="请输入活动描述" />
            </Form.Item>
            <Form.Item
              name="location"
              label="活动地点"
              rules={[{ required: true, message: '请输入活动地点' }]}
            >
              <Input placeholder="请输入活动地点" />
            </Form.Item>
            <Form.Item
              name="timeRange"
              label="活动时间"
              rules={[{ required: true, message: '请选择活动时间' }]}
            >
              <RangePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item
              name="signupRange"
              label="报名时间"
              rules={[{ required: true, message: '请选择报名时间' }]}
            >
              <RangePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item
              name="leader_id"
              label="负责人ID"
              rules={[{ required: true, message: '请输入负责人ID' }]}
            >
              <Input placeholder="请输入负责人ID" />
            </Form.Item>
            <Form.Item
              name="budget"
              label="预算"
              rules={[{ required: true, message: '请输入预算' }]}
            >
              <InputNumber
                placeholder="请输入预算"
                style={{ width: '100%' }}
                min={0}
                precision={2}
              />
            </Form.Item>
            <Form.Item
              name="maxPeople"
              label="最大人数"
              rules={[{ required: true, message: '请输入最大人数' }]}
            >
              <InputNumber
                placeholder="请输入最大人数"
                style={{ width: '100%' }}
                min={1}
              />
            </Form.Item>
            <Form.Item
              name="status"
              label="状态"
              initialValue="pending"
            >
              <Select>
                <Select.Option value="pending">待开始</Select.Option>
                <Select.Option value="active">进行中</Select.Option>
                <Select.Option value="completed">已完成</Select.Option>
                <Select.Option value="cancelled">已取消</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  创建
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

