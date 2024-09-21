import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import Quiz from './Quiz';
import QuizList from './QuizList';
import UserProfile from './UserProfile';
import Scoreboard from './Scoreboard';
import SubmitQuiz from './SubmitQuiz';
import NavBar from './NavBar';
import { UserProvider } from './context/UserContext'; 

const App = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="*"
          element={
            <div>
              <NavBar />
              <Routes>
                <Route path="/quiz/:id" element={<Quiz />} />
                <Route path="/quizzes" element={<QuizList />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/scoreboard" element={<Scoreboard />} />
                <Route path="/submit-quiz" element={<SubmitQuiz />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          }
        />
      </Routes>
    </UserProvider>
  );
};

export default App;
