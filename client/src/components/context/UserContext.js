import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from '../axiosConfig'; 
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

// Create the UserContext
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to fetch user data using token
  const fetchUser = useCallback(async (token) => {
    try {
      const decoded = jwtDecode(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`/users/${decoded.sub}`);
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, []);

  // Check token and fetch user on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');
  }, [navigate]);

  // Function to refresh token periodically
  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await axios.post('/refresh', {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
          },
        });
        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        fetchUser(access_token);
      } catch (error) {
        console.error('Error refreshing token:', error);
        logout();
      }
    };

    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp - currentTime < 300) {
          refreshToken();
        }
      }
    }, 60000); 

    return () => clearInterval(interval);
  }, [logout, fetchUser]);

  // Login function
const login = async (username, password) => {
    try {
      const response = await axios.post('/login', { username, password });
      const { access_token, refresh_token, user } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      setUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      navigate('/quiz');  // Redirect to /quiz instead of /quizzes
    } catch (error) {
      console.error('Login error', error);
      throw error;
    }
  };
  

  // Register function
  const register = async (username, password) => {
    try {
      await axios.post('/register', { username, password });
      navigate('/');  
    } catch (error) {
      console.error('Registration error', error);
      throw error;
    }
  };

  // Authentication function to verify user with password
  const authenticateUser = async (password) => {
    try {
      const response = await axios.post('/authenticate', { password });
      return response.data.authenticated;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        register,
        authenticateUser,
        logout,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
