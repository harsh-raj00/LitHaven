import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('lithaven_token') || null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' or 'register'
  const { showToast } = useToast();

  // Load user data on startup if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await api.auth.getMe();
        if (data.success) {
          setUser(data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Failed to restore session:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await api.auth.login({ email, password });
      if (data.success) {
        localStorage.setItem('lithaven_token', data.token);
        setToken(data.token);
        setUser(data.user);
        setAuthModalOpen(false);
        showToast(`Welcome back, ${data.user.name}!`, 'success');
        return data;
      }
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const data = await api.auth.register(userData);
      if (data.success) {
        localStorage.setItem('lithaven_token', data.token);
        setToken(data.token);
        setUser(data.user);
        setAuthModalOpen(false);
        showToast(`Account created! Welcome to LitHaven, ${data.user.name}!`, 'success');
        return data;
      }
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('lithaven_token');
    setToken(null);
    setUser(null);
    showToast('You have been logged out safely.', 'info');
  };

  const updateProfile = async (profileData) => {
    try {
      const data = await api.auth.updateProfile(profileData);
      if (data.success) {
        setUser((prev) => ({ ...prev, ...data.user }));
        showToast('Profile updated successfully!', 'success');
        return data.user;
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
      throw err;
    }
  };

  const demoLogin = async (persona = 'engineering') => {
    const credentials = {
      engineering: { email: 'aanya@lithaven.edu', password: 'password123' },
      medical: { email: 'marcus@lithaven.edu', password: 'password123' },
      commerce: { email: 'sophia@lithaven.edu', password: 'password123' },
      hardware: { email: 'rohan@lithaven.edu', password: 'password123' }
    };

    const target = credentials[persona] || credentials.engineering;
    return await login(target.email, target.password);
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        demoLogin,
        authModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
