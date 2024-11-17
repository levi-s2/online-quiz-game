import React, { useState, useCallback } from 'react';
import { Layout, message } from 'antd';
import axios from './axiosConfig';
import Menu from './Menu';
import Game from './Game';

const { Content } = Layout;

const Quiz = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);

  const fetchQuizData = useCallback(async (id) => {
    setQuizLoading(true);
    try {
      const response = await axios.get(`/quizzes/${id}`);
      setQuizData(response.data);
    } catch (error) {
      console.error('Error fetching quiz data:', error);
    } finally {
      setQuizLoading(false);
    }
  }, []);

  const handleQuizSelect = (id) => {
    setQuizId(id);
    fetchQuizData(id);
  };

  const handleRandomQuiz = async () => {
    setQuizLoading(true);
    try {
        const response = await axios.get('/quizzes/random');
        console.log('Random Quiz Response:', response.data);
        if (response.data && response.data.id) {
            setQuizId(response.data.id); 
            setQuizData(response.data); 
        } else {
            message.error('No random quiz found.');
        }
    } catch (error) {
        message.error('Error loading a random quiz.');
        console.error('Error fetching random quiz:', error);
    } finally {
        setQuizLoading(false);
    }
};

  const handlePlayAgain = () => {
    if (quizId) {
      fetchQuizData(quizId);
    }
  };

  return (
    <Layout className="quiz-layout" style={{ minHeight: '100vh' }}>
      <Menu
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onQuizSelect={handleQuizSelect}
      />
      <Layout style={{ padding: '0 24px 24px' }}>
        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
          <Game
            quizData={quizData}
            onPlayAgain={handlePlayAgain}
            onPlayRandomQuiz={handleRandomQuiz}
            quizLoading={quizLoading}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Quiz;