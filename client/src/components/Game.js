import React, { useState, useEffect } from 'react';
import { Button, message, Alert, Card, Typography } from 'antd';

const { Text, Title } = Typography;

const Game = ({ quizData, onPlayAgain, onPlayRandomQuiz, quizLoading }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    console.log('Updated quizData:', quizData);

    if (quizData?.questions?.length) {
      console.log('Resetting game state for new quiz');
      setCurrentQuestionIndex(0);
      setScore(0);
      setQuizCompleted(false);
      setSelectedAnswer(null);
    }
  }, [quizData]);

  const handleAnswerSelect = (option) => {
    console.log('Answer selected:', option);
    setSelectedAnswer(option);
  };

  const handleNextQuestion = () => {
    if (!selectedAnswer) {
      message.warning('Please select an answer before proceeding.');
      return;
    }

    console.log('Moving to the next question');
    if (selectedAnswer.is_correct) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      console.log('Quiz completed');
      setQuizCompleted(true);
    }

    setSelectedAnswer(null);
  };

  return (
    <div className="game-container">
      {!quizData || !quizData.questions?.length ? (
        <Card className="quiz-info-card">
          <Title level={4}>Select a quiz to start playing</Title>
          <Button
            type="primary"
            onClick={() => {
              console.log('Play Random Quiz button clicked');
              onPlayRandomQuiz();
            }}
            loading={quizLoading}
          >
            Play Random Quiz
          </Button>
        </Card>
      ) : !quizCompleted ? (
        <Card title={`Question ${currentQuestionIndex + 1}`} className="question-card">
          <h3 className="question-text">{quizData.questions[currentQuestionIndex]?.text || 'Loading...'}</h3>
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
          <Button type="primary" onClick={handleNextQuestion} className="next-button">
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
          action={
            <>
              <Button
                onClick={() => {
                  console.log('Play Again button clicked');
                  onPlayAgain();
                }}
                style={{ marginRight: 8 }}
              >
                Play Again
              </Button>
              <Button
                onClick={() => {
                  console.log('Play Random Quiz button clicked after quiz completion');
                  onPlayRandomQuiz();
                }}
                type="default"
                loading={quizLoading}
              >
                Play Random Quiz
              </Button>
            </>
          }
        />
      )}
    </div>
  );
};

export default Game;