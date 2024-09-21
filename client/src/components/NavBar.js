import React, { useState, useEffect, useContext } from 'react';
import { AppstoreOutlined, UserOutlined, LogoutOutlined, PlusOutlined, ReadOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from './context/UserContext';

const NavBar = () => {
  const { logout } = useContext(UserContext);
  const [current, setCurrent] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname.split('/')[1];
    setCurrent(path || 'quiz');
  }, [location]);

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const items = [
    {
      label: <Link to="/quiz">Quiz</Link>,
      key: 'quiz',
      icon: <AppstoreOutlined />,
    },
    {
      label: <Link to="/quizzes">My List</Link>,
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
      onClick: handleLogout,
    },
  ];

  return (
    <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
  );
};

export default NavBar;
