import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './context/UserContext';
import { Card, List, Button, Select, Typography, Spin, Alert, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import defaultAvatar from '../css/avatar-15.png';
import UserManagement from './UserManagement';
import axios from './axiosConfig';

const { Title } = Typography;
const { Option } = Select;

const UserProfile = () => {
  const {
    user,
    loading,
    deleteFriend,
    fetchFavoriteCategories,
    addFavoriteCategory,
    removeFavoriteCategory,
  } = useContext(UserContext);

  const [categories, setCategories] = useState([]);
  const [favoriteCategories, setFavoriteCategories] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setLoadingFavorites(true);
        setLoadingCategories(true);
        try {
          const fetchedFavorites = await fetchFavoriteCategories(user.id);
          setFavoriteCategories(fetchedFavorites);

          const response = await axios.get('/categories');
          setCategories(response.data);

          message.success('Categories and favorites fetched successfully!');
        } catch (error) {
          console.error('Error fetching categories or favorites:', error);
          message.error('Error fetching categories or favorites.');
        } finally {
          setLoadingFavorites(false);
          setLoadingCategories(false);
        }
      }
    };

    fetchData();
  }, [user, fetchFavoriteCategories]);

  if (loading || loadingFavorites || loadingCategories) {
    return <Spin size="large" />;
  }

  if (!user) {
    return <Alert message="Error" description="User not found" type="error" />;
  }

  return (
    <div className="user-profile">
      <Card className="profile-card">
        <Title level={2}>User Profile</Title>
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
              <p>
                <strong>Average Score:</strong> {user.average_score?.toFixed(2)}%
              </p>
              <p>
                <strong>Total Quizzes Completed:</strong> {user.total_quizzes_completed || 0}
              </p>
            </Card>

            <UserManagement user={user} />
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
                          onClick={() => deleteFriend(friend.id)}
                        />,
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
      </Card>
    </div>
  );
};

export default UserProfile;
