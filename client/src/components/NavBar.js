import React, { useContext, useState, useEffect } from 'react';
import { Menu } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import { AppstoreOutlined, UserOutlined, LogoutOutlined, PlusOutlined } from '@ant-design/icons';

const NavBar = () => {
  const { user, logout } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [current, setCurrent] = useState('');

  useEffect(() => {
    const path = location.pathname.split('/')[1];
    setCurrent(path || 'quiz');
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  const items = [
    { label: <Link to="/quiz">Quiz</Link>, key: 'quiz', icon: <AppstoreOutlined /> },
    { label: <Link to="/submit-quiz">Submit a Quiz</Link>, key: 'submit-quiz', icon: <PlusOutlined /> },
    { label: <Link to="/scoreboard">Scoreboard</Link>, key: 'scoreboard', icon: <AppstoreOutlined /> },
    { label: <Link to="/profile">My Profile</Link>, key: 'profile', icon: <UserOutlined /> },
    { label: 'Logout', key: 'logout', icon: <LogoutOutlined />, onClick: handleLogout },
  ];

  return (
    <Menu onClick={(e) => setCurrent(e.key)} selectedKeys={[current]} mode="horizontal" items={items} />
  );
};

export default NavBar;