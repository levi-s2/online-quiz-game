import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button } from 'antd';
import axios from './axiosConfig';

const { Sider, Content } = Layout;

const Quiz = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch quiz when a category is selected
  useEffect(() => {
    if (selectedCategory) {
      const fetchQuiz = async () => {
        try {
          const response = await axios.get(`/quizzes/by_category?category=${selectedCategory}`);
          if (response.data.length > 0) {
            const quiz = response.data[0];
            setCurrentQuestion(quiz.questions[0]);
          }
        } catch (error) {
          console.error('Error fetching quiz:', error);
        }
      };

      fetchQuiz();
    }
  }, [selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

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
          <div className="quiz-question-container">
            {currentQuestion ? (
              <>
                <div className="question-box">
                  <h2>{currentQuestion.text}</h2>
                </div>
                <div className="options-container">
                  {currentQuestion.options.map((option, index) => (
                    <Button key={index} className="quiz-option">
                      {option.text}
                    </Button>
                  ))}
                </div>
              </>
            ) : (
              <p>Select a category to start the quiz.</p>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Quiz;
