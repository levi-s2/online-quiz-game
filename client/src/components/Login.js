import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { UserContext } from './context/UserContext';
import { Button, Form as BootstrapForm, Container } from 'react-bootstrap';

const Login = () => {
  const { login } = useContext(UserContext);

  // Validation schema for Formik
  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  // Handle form submission
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
    <Container className="login-container">
      <h2 className="login-title">Login</h2>

      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form className="login-form">
            <div className="form-group username-field">
              <BootstrapForm.Label htmlFor="username">Username</BootstrapForm.Label>
              <Field
                type="text"
                name="username"
                className="form-control"
              />
              <ErrorMessage name="username" component="div" className="text-danger" />
            </div>

            <div className="form-group password-field">
              <BootstrapForm.Label htmlFor="password">Password</BootstrapForm.Label>
              <Field
                type="password"
                name="password"
                className="form-control"
              />
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>

            {errors.general && <div className="text-danger">{errors.general}</div>}

            <div className="form-group submit-button">
              <Button type="submit" disabled={isSubmitting} className="btn btn-primary">
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default Login;
