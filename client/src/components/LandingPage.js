import React, { useState, useContext } from 'react';
import { UserContext } from './context/UserContext';
import Register from './Register';
import Login from './Login';
import { Button, Container } from 'react-bootstrap';

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const [showRegister, setShowRegister] = useState(true);

  const toggleForm = () => setShowRegister(!showRegister);

  return (
    <Container className="landing-page-container text-center">
      <h1 className="landing-page-title">Welcome to the Quiz Game</h1>

      <Button
        className="play-button mb-4"
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
              <Button variant="link" onClick={toggleForm}>
                Sign In
              </Button>
            </p>
          </>
        ) : (
          <>
            <Login />
            <p className="toggle-text">
              Don't have an account?{' '}
              <Button variant="link" onClick={toggleForm}>
                Register
              </Button>
            </p>
          </>
        )}
      </div>
    </Container>
  );
};

export default LandingPage;
