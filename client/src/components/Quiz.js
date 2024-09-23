import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, message } from 'antd';
import axios from './axiosConfig';

const { Sider, Content } = Layout;

const Quiz = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Track selected answer
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories');
        setCategories(response.data);
        if (response.data.length > 0) {
          setSelectedCategory(response.data[0].name);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchQuizData = async () => {
      if (!selectedCategory) return;
      try {
        const response = await axios.get(`/quizzes/by_category?category=${selectedCategory}`);
        if (response.data.length > 0) {
          setQuizData(response.data[0]);
          setCurrentQuestionIndex(0); // Reset to first question
        } else {
          setQuizData(null);
        }
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchQuizData();
  }, [selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setQuizData(null);
    setSelectedAnswer(null);
    setScore(0); // Reset score on category change
  };

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);
  };

  const handleNextQuestion = () => {
    if (!selectedAnswer) {
      message.warning('Please select an answer before proceeding.');
      return;
    }

    // Check if the selected answer is correct
    if (selectedAnswer.is_correct) {
      setScore((prevScore) => prevScore + 1);
    }

    // Move to the next question or finish the quiz
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      message.success(`Quiz completed! You scored ${score + (selectedAnswer.is_correct ? 1 : 0)} out of ${quizData.questions.length}.`);
    }

    // Reset selected answer
    setSelectedAnswer(null);
  };

  const currentQuestion = quizData?.questions[currentQuestionIndex];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} className="quiz-sider">
        <Menu
          mode="vertical"
          selectedKeys={[selectedCategory]}
          onClick={(e) => handleCategoryChange(e.key)}
        >
          {categories.map((category) => (
            <Menu.Item key={category.name}>{category.name}</Menu.Item>
          ))}
        </Menu>
      </Sider>

      <Layout style={{ padding: '0 24px 24px' }}>
        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
          {quizData && currentQuestion ? (
            <div className="quiz-question-container">
              <div className="question-box">
                <h2>{currentQuestion.text}</h2>
              </div>
              <div className="options-container">
                {currentQuestion.options.length > 0 ? (
                  currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      className={`quiz-option ${selectedAnswer?.id === option.id ? 'selected' : ''}`}
                      onClick={() => handleAnswerSelect(option)}
                    >
                      {option.text}
                    </Button>
                  ))
                ) : (
                  <p>No options available for this question</p>
                )}
              </div>
              <Button type="primary" onClick={handleNextQuestion} style={{ marginTop: '20px' }}>
                {currentQuestionIndex < quizData.questions.length - 1 ? 'Next Question' : 'Submit Quiz'}
              </Button>
            </div>
          ) : (
            <p>Select a category to start the quiz.</p>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Quiz;
