import React, { useContext } from 'react';
import { UserContext } from './context/UserContext'; 
import { Card, Spin, Alert, List, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import defaultAvatar from '../css/avatar-15.png'; 

const UserProfile = () => {
  const { user, loading, deleteFriend } = useContext(UserContext);

  const handleDeleteFriend = async (friendId) => {
    try {
      await deleteFriend(friendId);
      message.success('Friend removed successfully!');
    } catch (error) {
      message.error('Error removing friend.');
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!user) {
    return <Alert message="Error" description="User not found" type="error" />;
  }

  return (
    <div className="profile-container" style={{ display: 'flex', padding: '20px' }}>
      <div className="left-column" style={{ flex: 1, marginRight: '20px' }}>
        <Card className="profile-card" style={{ textAlign: 'center' }}>
          <img
            src={defaultAvatar} 
            alt="User Avatar"
            className="profile-image"
            style={{ width: '150px', borderRadius: '50%', marginBottom: '20px' }}
          />
          <h2>{user.username}</h2>
        </Card>
      </div>

      <div className="center-column" style={{ flex: 2 }}>
        <h3>User's Quiz Performance</h3>
        <Card>
          <p><strong>Average Score:</strong> {user.average_score?.toFixed(2)}%</p>
          <p><strong>Total Quizzes Completed:</strong> {user.total_quizzes_completed || 0}</p>
        </Card>
      </div>

      <div className="right-column" style={{ flex: 1, marginLeft: '20px' }}>
        <h3>Friends</h3>
        <Card>
          {user.friends && user.friends.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={user.friends}
              renderItem={(friend) => (
                <List.Item
                  actions={[
                    <Button
                      type="link"
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteFriend(friend.id)}
                    />
                  ]}
                >
                  <List.Item.Meta
                    title={<Link to={`/user/${friend.id}`}>{friend.username}</Link>}
                  />
                </List.Item>
              )}
            />
          ) : (
            <p>No friends added yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;