import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import Quiz from './Quiz';
import QuizList from './QuizList';
import UserProfile from './UserProfile';
import Scoreboard from './Scoreboard';
import SubmitQuiz from './SubmitQuiz';
import NavBar from './NavBar';
import { UserProvider, UserContext } from './context/UserContext';

const LayoutWithNavBar = ({ children }) => {
  const { user } = useContext(UserContext);

  return (
    <div>
      {user && <NavBar />}
      {children}
    </div>
  );
};

const App = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quiz" element={<LayoutWithNavBar><Quiz /></LayoutWithNavBar>} />
        <Route path="/quizzes" element={<LayoutWithNavBar><QuizList /></LayoutWithNavBar>} />
        <Route path="/profile" element={<LayoutWithNavBar><UserProfile /></LayoutWithNavBar>} />
        <Route path="/scoreboard" element={<LayoutWithNavBar><Scoreboard /></LayoutWithNavBar>} />
        <Route path="/submit-quiz" element={<LayoutWithNavBar><SubmitQuiz /></LayoutWithNavBar>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </UserProvider>
  );
};

export default App;
