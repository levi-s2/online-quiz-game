// Login.js

import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { UserContext } from './context/UserContext';
import { Button, Input, Typography } from 'antd';

const { Title } = Typography;

const Login = () => {
  const { login } = useContext(UserContext);

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await login(values.username, values.password);
    } catch (error) {
      setErrors({ general: 'Login failed. Please check your credentials.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-form">
      <Title level={2}>Login</Title>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            <div className="form-item">
              <Field name="username">
                {({ field }) => (
                  <Input {...field} placeholder="Username" />
                )}
              </Field>
              <ErrorMessage name="username" component="div" className="error-message" />
            </div>

            <div className="form-item">
              <Field name="password">
                {({ field }) => (
                  <Input.Password {...field} placeholder="Password" />
                )}
              </Field>
              <ErrorMessage name="password" component="div" className="error-message" />
            </div>

            {errors.general && <div className="error-message">{errors.general}</div>}

            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              className="submit-button"
              block
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;