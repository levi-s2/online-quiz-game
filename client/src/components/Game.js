import React, { useState, useEffect, useCallback } from 'react';
import { Button, Alert, Card, Typography, message } from 'antd';
import axios from './axiosConfig';

const { Text, Title } = Typography;

const Game = ({ quizData, onPlayAgain, onPlayRandomQuiz, quizLoading }) => {
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (quizData?.questions?.length) {
      setIsQuizStarted(false);
      setCurrentQuestionIndex(0);
      setScore(0);
      setQuizCompleted(false);
      setSelectedAnswer(null);
      setTimeLeft(30);
    }
  }, [quizData]);

  const submitQuizScore = useCallback(async () => {
    if (!quizData?.id) return;
    try {
      console.log('Submitting score:', score, 'for quiz ID:', quizData.id);
      await axios.post('/submit_score', {
        quiz_id: quizData.id,
        points: score,
      });
      message.success('Your score has been submitted successfully!');
    } catch (error) {
      console.error('Error submitting score:', error);
      message.error('Failed to submit your score. Please try again later.');
    }
  }, [score, quizData?.id]);

  const handleNextQuestion = useCallback(() => {
    if (selectedAnswer?.is_correct) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestionIndex < quizData?.questions?.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      setQuizCompleted(true);
      submitQuizScore(); 
    }
  }, [currentQuestionIndex, quizData?.questions?.length, selectedAnswer, submitQuizScore]);

  useEffect(() => {
    if (!isQuizStarted || quizCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isQuizStarted, quizCompleted, handleNextQuestion]);

  const handleStartQuiz = () => {
    setIsQuizStarted(true);
    setTimeLeft(30);
  };

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);
  };

  return (
    <div className="game-container">
      {!quizData ? (
        <Card className="quiz-info-card">
          <Title level={4}>Select a quiz to start playing</Title>
          <Button type="primary" onClick={onPlayRandomQuiz} loading={quizLoading}>
            Play Random Quiz
          </Button>
        </Card>
      ) : !isQuizStarted ? (
        <Card className="quiz-start-card">
          <Title level={4}>{quizData.category?.name} - Quiz {quizData.id}</Title>
          <p>Number of Questions: {quizData.questions.length}</p>
          <Button type="primary" onClick={handleStartQuiz} style={{ marginTop: 16 }}>
            Play Quiz
          </Button>
        </Card>
      ) : !quizCompleted ? (
        <Card title={`Question ${currentQuestionIndex + 1}`} className="question-card">
          <h3 className="question-text">{quizData.questions[currentQuestionIndex]?.text || 'Loading...'}</h3>
          <div className="timer-container">
            <Text strong style={{ fontSize: '16px' }}>Time Left: {timeLeft}s</Text>
          </div>
          <div className="options-container">
            {quizData.questions[currentQuestionIndex]?.options.map((option, index) => (
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
            disabled={!selectedAnswer}
          >
            {currentQuestionIndex < quizData.questions.length - 1 ? 'Next Question' : 'Submit Quiz'}
          </Button>
        </Card>
      ) : (
        <Alert
          message="Quiz Completed"
          description={`You scored ${score} out of ${quizData.questions.length}`}
          type="success"
          showIcon
          className="score-alert"
        />
      )}
    </div>
  );
};

export default Game;