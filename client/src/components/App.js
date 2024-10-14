import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import Home from './Home'; 
import QuizList from './QuizList';
import UserProfile from './UserProfile';
import UserDetails from './UserDetails';
import Scoreboard from './Scoreboard';
import SubmitQuiz from './SubmitQuiz';
import NavBar from './NavBar';
import { UserContext, UserProvider } from './context/UserContext';

const LayoutWithNavBar = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!user) {
    return null; 
  }

  return (
    <div>
      <NavBar />
      {children}
    </div>
  );
};

const App = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="*"
          element={
            <LayoutWithNavBar>
              <Routes>
                <Route path="/quiz" element={<Home />} /> 
                <Route path="/quizzes" element={<QuizList />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/user/:id" element={<UserDetails />} />
                <Route path="/scoreboard" element={<Scoreboard />} />
                <Route path="/submit-quiz" element={<SubmitQuiz />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </LayoutWithNavBar>
          }
        />
      </Routes>
    </UserProvider>
  );
};

export default App;