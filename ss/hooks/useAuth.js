import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const token = await AsyncStorage.getItem('userToken');
      
      if (userData && token) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await axios.get(`${config.getApiUrl()}/user-profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      await AsyncStorage.setItem('userData', JSON.stringify(response.data));
      setUser(response.data);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('userToken');
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return {
    user,
    loading,
    refreshUserData,
    logout
  };
}; 