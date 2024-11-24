import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './context/UserContext';
import { Card, List, Button, Select, Typography, Spin, Alert, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import defaultAvatar from '../css/avatar-15.png';
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
          // Fetch user's favorite categories
          const fetchedFavorites = await fetchFavoriteCategories(user.id);
          setFavoriteCategories(fetchedFavorites);

          // Fetch all categories
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

  const handleAddFavoriteCategory = async (categoryId) => {
    try {
      await addFavoriteCategory(user.id, categoryId);
      const updatedFavorites = await fetchFavoriteCategories(user.id);
      setFavoriteCategories(updatedFavorites);
      message.success('Category added to favorites!');
    } catch (error) {
      console.error('Error adding favorite category:', error);
      message.error('Error adding category to favorites.');
    }
  };

  const handleRemoveFavoriteCategory = async (categoryId) => {
    try {
      await removeFavoriteCategory(user.id, categoryId);
      const updatedFavorites = await fetchFavoriteCategories(user.id);
      setFavoriteCategories(updatedFavorites);
      message.success('Category removed from favorites!');
    } catch (error) {
      console.error('Error removing favorite category:', error);
      message.error('Error removing category from favorites.');
    }
  };

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

            <h3>Favorite Categories</h3>
            <Card>
              {favoriteCategories && favoriteCategories.length > 0 ? (
                <List
                  itemLayout="horizontal"
                  dataSource={favoriteCategories}
                  renderItem={(category) => (
                    <List.Item
                      actions={[
                        <Button
                          type="link"
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveFavoriteCategory(category.id)}
                        />,
                      ]}
                    >
                      <List.Item.Meta title={category.name} />
                    </List.Item>
                  )}
                />
              ) : (
                <p>No favorite categories added yet.</p>
              )}
            </Card>

            <h3>Select Favorite Categories</h3>
            <Card>
              <Select
                style={{ width: '100%' }}
                placeholder="Select a category to add to favorites"
                onChange={handleAddFavoriteCategory}
              >
                {categories
                  .filter(
                    (category) =>
                      !favoriteCategories.some((favCategory) => favCategory.id === category.id)
                  )
                  .map((category) => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
              </Select>
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
