import React, { useContext } from 'react';
import { UserContext } from './context/UserContext'; 
import { Card, Spin, Alert } from 'antd';

const UserProfile = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <Spin size="large" />;
  }

  if (!user) {
    return <Alert message="Error" description="User not found" type="error" />;
  }

  return (
    <div className="profile-container">
      <div className="left-column">
        <Card className="profile-card">
          <img
            src={'/path/to/avatar/image.png'} 
            alt="User Avatar"
            className="profile-image"
          />
          <div className="profile-info">
            <h2>{user.username}</h2>
            <p>Average Quiz Score: {user.average_score?.toFixed(2)}%</p>
            <p>Total Quizzes Completed: {user.total_quizzes_completed || 0}</p>
          </div>
        </Card>
      </div>
      <div className="center-column">
        <h3>User's Quiz Performance</h3>
        <Card>
          <p><strong>Average Score:</strong> {user.average_score?.toFixed(2)}%</p>
          <p><strong>Total Quizzes Completed:</strong> {user.total_quizzes_completed || 0}</p>
        </Card>
      </div>
      <div className="right-column">
        <h3>Friends</h3>
        <Card>
          <p>No friends added yet.</p>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
