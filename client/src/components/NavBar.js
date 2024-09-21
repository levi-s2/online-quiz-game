import React, { useState, useEffect } from 'react';
import { AppstoreOutlined, UserOutlined, LogoutOutlined, PlusOutlined, ReadOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const NavBar = ({ isAuthenticated, logout }) => {
  const [current, setCurrent] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname.split('/')[1];
    setCurrent(path || 'home');
  }, [location]);

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const handleLogout = () => {
    logout();  // Call the logout function
    navigate('/');  // Navigate to landing page after logout
  };

  // Only show the navbar if the user is authenticated
  if (!isAuthenticated) return null;

  const items = [
    {
      label: <Link to="/">Home</Link>,
      key: 'home',
      icon: <AppstoreOutlined />,
    },
    {
      label: <Link to="/quizzes">Quizzes</Link>,
      key: 'quizzes',
      icon: <ReadOutlined />,
    },
    {
      label: <Link to="/submit-quiz">Submit a Quiz</Link>,
      key: 'submit-quiz',
      icon: <PlusOutlined />,
    },
    {
      label: <Link to="/scoreboard">Scoreboard</Link>,
      key: 'scoreboard',
      icon: <AppstoreOutlined />,
    },
    {
      label: <Link to="/profile">My Profile</Link>,
      key: 'profile',
      icon: <UserOutlined />,
    },
    {
      label: 'Logout',
      key: 'logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,  // Call logout handler
    },
  ];

  return (
    <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
  );
};

export default NavBar;
