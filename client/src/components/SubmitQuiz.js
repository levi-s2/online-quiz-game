// SubmitQuiz.js

import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message, Divider, Row, Col, Select, Card } from 'antd';
import axios from './axiosConfig';
import '../css/App.css';

const { Option } = Select;

const approvedCategories = ['math', 'science', 'history', 'music', 'general knowledge'];

const SubmitQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    options: Array(5).fill().map(() => ({ text: '', is_correct: false }))
  });
  const [category, setCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleOptionChange = (value, index) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index].text = value;
    setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
  };

  const handleCorrectOptionChange = (index) => {
    const updatedOptions = currentQuestion.options.map((option, i) => ({
      ...option,
      is_correct: i === index
    }));
    setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
  };

  const handleQuestionTextChange = (e) => {
    setCurrentQuestion({ ...currentQuestion, text: e.target.value });
  };

  const addQuestion = () => {
    if (!currentQuestion.text.trim()) {
      message.error('Please enter a question');
      return;
    }

    if (currentQuestion.options.some(option => !option.text.trim())) {
      message.error('Please fill in all the answer options');
      return;
    }

    if (!currentQuestion.options.some(option => option.is_correct)) {
      message.error('Please select the correct answer');
      return;
    }

    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion({
      text: '',
      options: Array(5).fill().map(() => ({ text: '', is_correct: false }))
    });
  };

  const handleSubmit = async () => {
    if (questions.length < 3) {
      message.error('You need at least 3 questions to submit the quiz.');
      return;
    }

    if (!category.trim()) {
      message.error('Please select a category.');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post('/submit_quiz', {
        category,
        questions
      });
      message.success('Quiz submitted successfully!');
      setQuestions([]);
      setCategory('');
    } catch (error) {
      message.error('Error submitting the quiz');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="submit-quiz-container">
      <h1>Submit a New Quiz</h1>
      <Divider />

      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Quiz Category">
          <Select
            value={category}
            onChange={setCategory}
            placeholder="Select a category"
          >
            {approvedCategories.map((cat) => (
              <Option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Question Text">
          <Input.TextArea
            value={currentQuestion.text}
            onChange={handleQuestionTextChange}
            placeholder="Enter the question text"
            rows={2}
          />
        </Form.Item>

        <Form.Item label="Answer Options">
          {currentQuestion.options.map((option, index) => (
            <Row key={index} className="option-row">
              <Col span={20}>
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option.text}
                  onChange={(e) => handleOptionChange(e.target.value, index)}
                />
              </Col>
              <Col span={4}>
                <Checkbox
                  checked={option.is_correct}
                  onChange={() => handleCorrectOptionChange(index)}
                >
                  Correct
                </Checkbox>
              </Col>
            </Row>
          ))}
        </Form.Item>

        <Button type="dashed" onClick={addQuestion} block>
          Add Question
        </Button>

        <Divider />

        <h3>Questions Added ({questions.length})</h3>
        {questions.map((q, index) => (
          <Card key={index} className="question-card" title={`Question ${index + 1}`}>
            <p>{q.text}</p>
            <ul>
              {q.options.map((opt, i) => (
                <li key={i} className={opt.is_correct ? 'correct-option' : ''}>
                  {opt.text} {opt.is_correct ? '(Correct)' : ''}
                </li>
              ))}
            </ul>
          </Card>
        ))}

        <Button
          type="primary"
          htmlType="submit"
          disabled={questions.length < 3}
          loading={submitting}
          block
        >
          Submit Quiz
        </Button>
      </Form>
    </div>
  );
};

export default SubmitQuiz;
