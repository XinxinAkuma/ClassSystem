import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { getClasses, getActivities, getAllUsers, getSignups } from '../api/services';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    classes: 0,
    activities: 0,
    users: 0,
    signups: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [classes, activities, users, signups] = await Promise.all([
          getClasses(),
          getActivities(),
          getAllUsers(),
          getSignups(),
        ]);
        setStats({
          classes: classes.length,
          activities: activities.length,
          users: users.length,
          signups: signups.length,
        });
      } catch (error) {
        console.error('获取统计数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>仪表盘</h1>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="班级总数"
              value={stats.classes}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="活动总数"
              value={stats.activities}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="用户总数"
              value={stats.users}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="报名总数"
              value={stats.signups}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

