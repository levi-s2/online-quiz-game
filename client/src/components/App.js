import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './Home';
import Quiz from './Quiz';
import QuizList from './QuizList';
import UserProfile from './UserProfile';
import Scoreboard from './Scoreboard';
import SubmitQuiz from './SubmitQuiz';
import NavBar from './NavBar';

const App = () => {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/quizzes" element={<QuizList />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/scoreboard" element={<Scoreboard />} />
        <Route path="/submit-quiz" element={<SubmitQuiz />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
