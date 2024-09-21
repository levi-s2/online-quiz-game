import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { UserContext } from './context/UserContext';
import { Button, Form as BootstrapForm, Container } from 'react-bootstrap';

const Register = () => {
  const { register } = useContext(UserContext);

  // Validation schema for Formik
  const validationSchema = Yup.object({
    username: Yup.string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters long'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters long'),
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await register(values.username, values.password);
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="register-container">
      <h2 className="register-title">Register</h2>

      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form className="register-form">
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
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default Register;
