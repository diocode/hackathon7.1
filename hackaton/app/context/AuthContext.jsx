import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    try {
      setLoading(true);
      // TODO: Implement actual authentication logic with your backend
      // For now, we'll just simulate a successful login
      const mockUser = {
        id: '1',
        email,
        name: 'Test User',
        preferences: [],
        watchlist: []
      };
      setUser(mockUser);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserPreferences = (preferences) => {
    setUser(prev => ({
      ...prev,
      preferences: [...prev.preferences, ...preferences]
    }));
  };

  const updateWatchlist = (item) => {
    setUser(prev => ({
      ...prev,
      watchlist: [...prev.watchlist, item]
    }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      updateUserPreferences,
      updateWatchlist
    }}>
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