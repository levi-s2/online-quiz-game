import React, { useState, useEffect } from 'react';
import axios from './axiosConfig';
import { Table, Spin, Alert } from 'antd';

const Scoreboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch leaderboard data from the backend
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

  // Define the columns for the table
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
    <div>
      <h1>Scoreboard</h1>
      <Table 
        dataSource={leaderboardData} 
        columns={columns} 
        rowKey="username" 
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Scoreboard;