import React, { createContext, useState, useContext } from 'react';
import database from '../services/database';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const userData = await database.getUser(email, password);
      if (userData) {
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    try {
      setLoading(true);
      const userId = await database.createUser(email, password);
      if (userId) {
        const userData = await database.getUser(email, password);
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const addToWatchlist = async (movie) => {
    if (!user) return false;
    try {
      await database.addToWatchlist(user.id, movie);
      const updatedWatchlist = await database.getWatchlist(user.id);
      setUser(prev => ({ ...prev, watchlist: updatedWatchlist }));
      return true;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      return false;
    }
  };

  const removeFromWatchlist = async (movieId) => {
    if (!user) return false;
    try {
      await database.removeFromWatchlist(user.id, movieId);
      const updatedWatchlist = await database.getWatchlist(user.id);
      setUser(prev => ({ ...prev, watchlist: updatedWatchlist }));
      return true;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      return false;
    }
  };

  const addUserPreference = async (movie) => {
    if (!user) return false;
    try {
      await database.addUserPreference(user.id, movie);
      const updatedPreferences = await database.getUserPreferences(user.id);
      setUser(prev => ({ ...prev, preferences: updatedPreferences }));
      return true;
    } catch (error) {
      console.error('Error adding preference:', error);
      return false;
    }
  };

  const watchlist = async () => {
    if (!user) return;
    try {
      const updatedWatchlist = await database.getWatchlist(user.id);
      setUser(prev => ({ ...prev, watchlist: updatedWatchlist }));
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        addToWatchlist,
        removeFromWatchlist,
        addUserPreference,
        watchlist,
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