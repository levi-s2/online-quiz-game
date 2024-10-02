import React, { useState, useEffect } from 'react';
import { Menu, Dropdown } from 'antd';
import axios from './axiosConfig';

const MenuComponent = ({ categories, selectedCategory, onCategoryChange, onQuizSelect }) => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!selectedCategory) return;
      try {
        const response = await axios.get(`/quizzes/by_category?category=${selectedCategory}`);
        setQuizzes(
          response.data.map((quiz, index) => ({
            ...quiz,
            name: `${selectedCategory} ${index + 1}`,
          }))
        );
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, [selectedCategory]);

  return (
    <Menu mode="vertical" selectedKeys={[selectedCategory]}>
      {categories.map((category) => (
        <Dropdown
          key={category.name}
          overlay={
            <Menu>
              {quizzes.map((quiz) => (
                <Menu.Item key={quiz.id} onClick={() => onQuizSelect(quiz.id)}>
                  {quiz.name}
                </Menu.Item>
              ))}
            </Menu>
          }
        >
          <Menu.Item onClick={() => onCategoryChange(category.name)}>
            {category.name}
          </Menu.Item>
        </Dropdown>
      ))}
    </Menu>
  );
};

export default MenuComponent;
