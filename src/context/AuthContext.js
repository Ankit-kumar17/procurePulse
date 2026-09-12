import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockApi } from '../services/mockApi';

const AuthContext = createContext();

const STORAGE_KEY = '@procurepulse_auth_v1';

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setIsLoggedIn(parsed.isLoggedIn || false);
        setUser(parsed.user || null);
      }
    } catch (e) {
      console.warn('Failed to load auth state:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (mobile = '9876543210', otp = '123456') => {
    setIsLoading(true);
    try {
      const res = await mockApi.getFarmer();
      const userData = res.data;
      setUser(userData);
      setIsLoggedIn(true);
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ isLoggedIn: true, user: userData })
      );
      return { success: true, user: userData };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (registrationData) => {
    setIsLoading(true);
    try {
      const res = await mockApi.registerFarmer(registrationData);
      const newFarmer = res.data;
      setUser(newFarmer);
      setIsLoggedIn(true);
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ isLoggedIn: true, user: newFarmer })
      );
      return { success: true, farmer: newFarmer };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setIsLoggedIn(false);
      setUser(null);
    } catch (e) {
      console.warn('Logout error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
