import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import Quiz from './Quiz'; 
import Menu from './Menu'; 
import axios from './axiosConfig';

const { Content } = Layout;

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null); 

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

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedQuiz(null); 
  };

  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Menu
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        onQuizSelect={handleQuizSelect}
      />
      <Layout style={{ padding: '0 24px 24px' }}>
        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
          {selectedQuiz ? (
            <Quiz quizId={selectedQuiz} /> 
          ) : (
            <p>Select a quiz to start playing.</p>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
