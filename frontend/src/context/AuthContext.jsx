import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('job_tracker_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('job_tracker_token') || null);
  const [loading, setLoading] = useState(true);

  // Check user profile validity on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.data);
          localStorage.setItem('job_tracker_user', JSON.stringify(res.data.data));
        } catch (err) {
          console.warn('Session verification failed:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: jwtToken, ...userData } = res.data.data;
    localStorage.setItem('job_tracker_token', jwtToken);
    localStorage.setItem('job_tracker_user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    const { token: jwtToken, ...userData } = res.data.data;
    localStorage.setItem('job_tracker_token', jwtToken);
    localStorage.setItem('job_tracker_user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    return res.data;
  };

  const demoLogin = async () => {
    // Try to login demo account first; if doesn't exist, create it
    const demoEmail = 'alex.dev@jobtrakr.com';
    const demoPassword = 'Password123!';
    try {
      return await login(demoEmail, demoPassword);
    } catch {
      // Create demo account if not exists
      return await register('Alex Johnson', demoEmail, demoPassword);
    }
  };

  const logout = () => {
    localStorage.removeItem('job_tracker_token');
    localStorage.removeItem('job_tracker_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        demoLogin,
        logout
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
