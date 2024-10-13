import React, { useState, useEffect, useContext } from 'react';
import { Button, message, Alert } from 'antd';
import axios from './axiosConfig';
import { UserContext } from './context/UserContext';

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
    <>
      {!quizCompleted && quizData && currentQuestion ? (
        <div>
          <h2>{currentQuestion.text}</h2>
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              className={selectedAnswer?.id === option.id ? 'selected' : ''}
              type={selectedAnswer?.id === option.id ? 'primary' : 'default'}
              onClick={() => handleAnswerSelect(option)}
            >
              {option.text}
            </Button>
          ))}
          <Button
            type="primary"
            onClick={handleNextQuestion}
            style={{ marginTop: '20px' }}
          >
            {currentQuestionIndex < quizData.questions.length - 1
              ? 'Next Question'
              : 'Submit Quiz'}
          </Button>
        </div>
      ) : quizCompleted ? (
        <div>
          <Alert
            message="Quiz Completed"
            description={`You scored ${score} out of ${quizData.questions.length}`}
            type="success"
            showIcon
          />
          <Button type="primary" onClick={handlePlayAgain} style={{ marginTop: '20px' }}>
            Play Again
          </Button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Quiz;