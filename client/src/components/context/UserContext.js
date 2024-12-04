import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from '../axiosConfig'; 
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');
  }, [navigate]);

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

  
  const login = async (username, password) => {
    try {
      const response = await axios.post('/login', { username, password });
      const { access_token, refresh_token, user } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      setUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      navigate('/quiz');  
    } catch (error) {
      console.error('Login error', error);
      throw error;
    }
  };
  
  const register = async (username, password) => {
    try {
      await axios.post('/register', { username, password });
      navigate('/');  
    } catch (error) {
      console.error('Registration error', error);
      throw error;
    }
  };

  const authenticateUser = async (password) => {
    try {
      const response = await axios.post('/authenticate', { password });
      return response.data.authenticated;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  };

  const addFriend = async (friendId) => {
    try {
      await axios.post('/friends', { friend_id: friendId });
      const updatedUser = await fetchUser(localStorage.getItem('token'));
      return updatedUser;
    } catch (error) {
      console.error('Error adding friend:', error);
      throw error;
    }
  };
  
  const deleteFriend = async (friendId) => {
    try {
      await axios.delete('/friends', { data: { friend_id: friendId } });
      const updatedUser = await fetchUser(localStorage.getItem('token'));
      return updatedUser;
    } catch (error) {
      console.error('Error removing friend:', error);
      throw error;
    }
  };
  
  

  const fetchUserDetailsById = async (id) => {
    try {
      const response = await axios.get(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  };

  const fetchFavoriteCategories = async (userId) => {
    try {
      const response = await axios.get(`/users/${userId}/favorite_categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching favorite categories:', error);
      throw error;
    }
  };
  
  const addFavoriteCategory = async (userId, categoryId) => {
    try {
      const response = await axios.post(`/users/${userId}/favorite_categories`, {
        category_id: categoryId,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding favorite category:', error);
      throw error;
    }
  };
  
  const removeFavoriteCategory = async (userId, categoryId) => {
    try {
      const response = await axios.delete(`/users/${userId}/favorite_categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing favorite category:', error);
      throw error;
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
        addFriend,
        deleteFriend,
        fetchUserDetailsById,
        fetchFavoriteCategories,
        addFavoriteCategory,
        removeFavoriteCategory
      }}
    >
      {children}
    </UserContext.Provider>
  );
};