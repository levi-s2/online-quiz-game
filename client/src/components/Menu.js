import React, { useState, useEffect } from 'react';
import { Menu, Dropdown, Button } from 'antd';
import axios from './axiosConfig';

const MenuComponent = ({ categories, selectedCategory, onCategoryChange, onQuizSelect }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

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

  const handleCategoryClick = (categoryName) => {
    onCategoryChange(categoryName);
    setOpenDropdown(openDropdown === categoryName ? null : categoryName);
  };

  return (
    <Menu mode="vertical" selectedKeys={[selectedCategory]}>
      {categories.map((category) => (
        <Menu.Item key={category.name}>
          <Dropdown
            overlay={
              <Menu>
                {quizzes.map((quiz) => (
                  <Menu.Item key={quiz.id} onClick={() => onQuizSelect(quiz.id)}>
                    {quiz.name}
                  </Menu.Item>
                ))}
              </Menu>
            }
            trigger={['click']}
            visible={openDropdown === category.name}
            onVisibleChange={(visible) => setOpenDropdown(visible ? category.name : null)}
          >
            <Button onClick={() => handleCategoryClick(category.name)}>
              {category.name}
            </Button>
          </Dropdown>
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default MenuComponent;
