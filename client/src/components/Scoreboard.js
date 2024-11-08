// Scoreboard.js

import React, { useState, useEffect } from 'react';
import axios from './axiosConfig';
import { Table, Spin, Alert, Card, Typography } from 'antd';
import { Link } from 'react-router-dom';
import '../css/App.css';

const { Title } = Typography;

const Scoreboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('/leaderboard');
        setLeaderboardData(response.data);
      } catch (error) {
        setError('Failed to fetch leaderboard data.');
        console.error('Error fetching leaderboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const columns = [
    {
      title: 'Rank',
      key: 'rank',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (username, record) => (
        <Link to={`/user/${record.id}`} className="username-link">
          {username}
        </Link>
      ),
    },
    {
      title: 'Average Score',
      dataIndex: 'average_score',
      key: 'average_score',
      render: (score) => `${score.toFixed(2)}%`, 
      sorter: (a, b) => a.average_score - b.average_score,
    },
    {
      title: 'Total Quizzes Completed',
      dataIndex: 'total_quizzes_completed',
      key: 'total_quizzes_completed',
    },
  ];

  if (loading) {
    return <Spin tip="Loading leaderboard..." />;
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  return (
    <div className="scoreboard-container">
      <Card className="scoreboard-card">
        <Title level={2} className="scoreboard-title">Scoreboard</Title>
        <Table 
          dataSource={leaderboardData} 
          columns={columns} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          bordered
        />
      </Card>
    </div>
  );
};

export default Scoreboard;
