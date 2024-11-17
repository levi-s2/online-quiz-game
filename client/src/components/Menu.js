import React, { useEffect, useState } from 'react';
import { Layout, Menu, Dropdown, Button, message } from 'antd';
import axios from './axiosConfig';
import { DownOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const MenuComponent = ({ selectedCategory, onCategoryChange, onQuizSelect }) => {
  const [categories, setCategories] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories');
        setCategories(response.data);
        if (response.data.length > 0 && !selectedCategory) {
          onCategoryChange(response.data[0].name);
        }
      } catch (error) {
        message.error('Failed to fetch categories. Please try again later.');
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [onCategoryChange, selectedCategory]);

  useEffect(() => {
    if (selectedCategory) {
      const fetchQuizzes = async () => {
        try {
          const response = await axios.get(`/quizzes/by_category?category=${selectedCategory}`);
          const updatedQuizzes = response.data.map((quiz, index) => ({
            ...quiz,
            name: `${selectedCategory} ${index + 1}`,
          }));
          setQuizzes(updatedQuizzes);
        } catch (error) {
          message.error('Failed to fetch quizzes for the selected category.');
          console.error('Error fetching quizzes:', error);
        }
      };

      fetchQuizzes();
    }
  }, [selectedCategory]);

  const handleCategoryClick = (categoryName) => {
    onCategoryChange(categoryName);
    setOpenDropdown(openDropdown === categoryName ? null : categoryName);
  };

  return (
    <Sider width={200} className="menu-sider">
      <Menu mode="inline" className="category-menu">
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
                {category.name} <DownOutlined />
              </Button>
            </Dropdown>
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
};

export default MenuComponent;