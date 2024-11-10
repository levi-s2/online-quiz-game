// LandingPage.js

import React, { useState, useContext } from 'react';
import { UserContext } from './context/UserContext';
import Register from './Register';
import Login from './Login';
import { Button, Typography, Card } from 'antd';
import '../css/App.css';

const { Title } = Typography;

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const [showRegister, setShowRegister] = useState(true);

  const toggleForm = () => setShowRegister(!showRegister);

  return (
    <div className="landing-page">
      <Card className="landing-card">
        <Title level={1} className="landing-title">Online Quiz Game</Title>

        <Button
          type="primary"
          className="play-button"
          size="large"
          onClick={() => console.log('Start Game!')}
          disabled={!user}
        >
          Play
        </Button>

        <div className="form-container">
          {showRegister ? (
            <>
              <Register />
              <p className="toggle-text">
                Already have an account?{' '}
                <Button type="link" onClick={toggleForm} className="toggle-link">
                  Sign In
                </Button>
              </p>
            </>
          ) : (
            <>
              <Login />
              <p className="toggle-text">
                Don't have an account?{' '}
                <Button type="link" onClick={toggleForm} className="toggle-link">
                  Register
                </Button>
              </p>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default LandingPage;
