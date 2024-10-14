import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spin, Alert, message } from 'antd';
import { UserContext } from './context/UserContext'; 
import defaultAvatar from '../css/avatar-15.png';

const UserDetails = () => {
  const { user, fetchUserDetailsById, addFriend, deleteFriend } = useContext(UserContext);
  const { id } = useParams(); 
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFriend, setIsFriend] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user && user.id === parseInt(id)) {
        navigate('/profile');
        return;
      }

      try {
        const data = await fetchUserDetailsById(id);
        setUserDetails(data);
        setLoading(false);
        const isFriendCheck = user?.friends.some(friend => friend.id === parseInt(id));
        setIsFriend(isFriendCheck);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id, user, navigate, fetchUserDetailsById]); 

  const handleAddFriend = async () => {
    try {
      await addFriend(userDetails.id);
      setIsFriend(true);
      message.success('Friend added successfully!');
    } catch (error) {
      message.error('Error adding friend.');
    }
  };

  const handleDeleteFriend = async () => {
    try {
      await deleteFriend(userDetails.id);
      setIsFriend(false);
      message.success('Friend removed successfully!');
    } catch (error) {
      message.error('Error removing friend.');
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!userDetails) {
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
          <h2>{userDetails.username}</h2>
          {isFriend ? (
            <Button type="danger" onClick={handleDeleteFriend}>
              Remove Friend
            </Button>
          ) : (
            <Button type="primary" onClick={handleAddFriend}>
              Add Friend
            </Button>
          )}
        </Card>
      </div>

      <div className="center-column" style={{ flex: 2 }}>
        <h3>User's Quiz Performance</h3>
        <Card>
          <p><strong>Average Score:</strong> {userDetails.average_score?.toFixed(2)}%</p>
          <p><strong>Total Quizzes Completed:</strong> {userDetails.total_quizzes_completed || 0}</p>
        </Card>
      </div>

      <div className="right-column" style={{ flex: 1, marginLeft: '20px' }}>
        <h3>Friends</h3>
        <Card>
          {userDetails.friends && userDetails.friends.length > 0 ? (
            <ul>
              {userDetails.friends.map(friend => (
                <li key={friend.id}>{friend.username}</li>
              ))}
            </ul>
          ) : (
            <p>No friends added yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default UserDetails;
