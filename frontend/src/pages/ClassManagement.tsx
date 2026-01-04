import { useState, useEffect } from 'react';
import { Card, Table, Space, Tag, message, Spin } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { getClasses } from '../api/services';
import type { Class } from '../api/types';

export default function ClassManagement() {
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const data = await getClasses();
      setClasses(data);
    } catch (error: any) {
      message.error(error.message || '加载班级列表失败');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '班级ID',
      dataIndex: 'class_id',
      key: 'class_id',
      width: 150,
    },
    {
      title: '班级名称',
      dataIndex: 'class_name',
      key: 'class_name',
      width: 200,
    },
    {
      title: '年级',
      dataIndex: 'grade',
      key: 'grade',
      width: 100,
    },
    {
      title: '专业',
      dataIndex: 'major',
      key: 'major',
      width: 200,
    },
    {
      title: '辅导员ID',
      dataIndex: 'counselor_id',
      key: 'counselor_id',
      width: 150,
    },
    {
      title: '成员数量',
      dataIndex: 'member_count',
      key: 'member_count',
      width: 120,
      render: (count: number) => (
        <Tag color={count > 0 ? 'blue' : 'default'}>{count}</Tag>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Space style={{ marginBottom: 24 }}>
          <TeamOutlined style={{ fontSize: 24, color: '#1890ff' }} />
          <h1 style={{ margin: 0 }}>班级管理</h1>
        </Space>

        <Table
          columns={columns}
          dataSource={classes}
          rowKey="class_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
}

