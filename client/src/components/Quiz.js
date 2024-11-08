// Quiz.js

import React, { useState, useEffect, useContext } from 'react';
import { Button, message, Alert, Card, Typography } from 'antd';
import axios from './axiosConfig';
import { UserContext } from './context/UserContext';
import '../css/App.css';

const { Text } = Typography;

const Quiz = ({ quizId }) => {
  const { user } = useContext(UserContext);
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(`/quizzes/${quizId}`);
        setQuizData(response.data);
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizCompleted(false);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchQuizData();
  }, [quizId]);

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);
  };

  const handleNextQuestion = async () => {
    if (!selectedAnswer) {
      message.warning('Please select an answer before proceeding.');
      return;
    }

    if (selectedAnswer.is_correct) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setQuizCompleted(true);
      await handleSubmitQuiz();
    }

    setSelectedAnswer(null);
  };

  const handleSubmitQuiz = async () => {
    if (!user || !user.id) {
      message.error('User is not authenticated.');
      return;
    }

    try {
      await axios.post('/submit_score', {
        user_id: user.id,
        quiz_id: quizData.id,
        points: score + (selectedAnswer?.is_correct ? 1 : 0),
      });
      message.success('Score submitted successfully!');
    } catch (error) {
      message.error('Error submitting score. Please try again.');
      console.error('Error submitting score:', error);
    }
  };

  const handlePlayAgain = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
  };

  const currentQuestion = quizData?.questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      {!quizCompleted && quizData && currentQuestion ? (
        <Card title={`Question ${currentQuestionIndex + 1}`} className="question-card">
          <h3 className="question-text">{currentQuestion.text}</h3>
          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                className={`option-button ${selectedAnswer?.id === option.id ? 'selected' : ''}`}
                type={selectedAnswer?.id === option.id ? 'primary' : 'default'}
                onClick={() => handleAnswerSelect(option)}
              >
                <Text className="option-label">{String.fromCharCode(65 + index)}:</Text>
                <Text className="option-text">{option.text}</Text>
              </Button>
            ))}
          </div>
          <Button
            type="primary"
            onClick={handleNextQuestion}
            className="next-button"
          >
            {currentQuestionIndex < quizData.questions.length - 1
              ? 'Next Question'
              : 'Submit Quiz'}
          </Button>
        </Card>
      ) : quizCompleted ? (
        <Alert
          message="Quiz Completed"
          description={`You scored ${score} out of ${quizData.questions.length}`}
          type="success"
          showIcon
          className="score-alert"
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Quiz;
