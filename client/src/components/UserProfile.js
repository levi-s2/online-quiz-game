import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from './context/UserContext';
import { Card, Spin, Alert, List, Button, message, Select } from 'antd';
import axios from './axiosConfig';
import { Link } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import defaultAvatar from '../css/avatar-15.png';

const { Option } = Select;

const UserProfile = () => {
  const { user, loading, deleteFriend, fetchFavoriteCategories, addFavoriteCategory,
    removeFavoriteCategory
   } = useContext(UserContext);
  const [favoriteCategories, setFavoriteCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setLoadingFavorites(true);
        try {
          const fetchedFavorites = await fetchFavoriteCategories(user.id);
          setFavoriteCategories(fetchedFavorites);
          const response = await axios.get('/categories');
          setCategories(response.data);
        } catch (error) {
          message.error('Error fetching categories or favorites.');
        } finally {
          setLoadingFavorites(false);
        }
      }
    };

    fetchData();
  }, [user]);

  const handleAddFavorite = async (categoryId) => {
    try {
      await addFavoriteCategory(user.id, categoryId);
      const updatedFavorites = await fetchFavoriteCategories(user.id);
      setFavoriteCategories(updatedFavorites);
      message.success('Category added to favorites!');
    } catch (error) {
      message.error('Error adding category to favorites.');
    }
  };

  const handleRemoveFavorite = async (categoryId) => {
    try {
      await removeFavoriteCategory(user.id, categoryId);
      const updatedFavorites = await fetchFavoriteCategories(user.id);
      setFavoriteCategories(updatedFavorites);
      message.success('Category removed from favorites!');
    } catch (error) {
      message.error('Error removing category from favorites.');
    }
  };

  const handleDeleteFriend = async (friendId) => {
    try {
      await deleteFriend(friendId);
      message.success('Friend removed successfully!');
    } catch (error) {
      message.error('Error removing friend.');
    }
  };

  if (loading || loadingFavorites) {
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
                      onClick={() => handleRemoveFavorite(category.id)}
                    />
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
        <h3>Add Favorite Category</h3>
        <Select
          style={{ width: '100%' }}
          placeholder="Select a category"
          onChange={handleAddFavorite}
        >
          {categories
            .filter((category) => !favoriteCategories.some((fav) => fav.id === category.id))
            .map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
        </Select>
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
