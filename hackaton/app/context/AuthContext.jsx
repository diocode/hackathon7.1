import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    // Mock login - accept any credentials
    setUser({
      id: 1,
      email: email,
      name: 'Test User',
      watchlist: [],
      preferences: {
        genres: [],
        languages: [],
      },
    });
  };

  const register = async (email, password) => {
    // Mock registration
    setUser({
      id: 1,
      email: email,
      name: 'New User',
      watchlist: [],
      preferences: {
        genres: [],
        languages: [],
      },
    });
  };

  const logout = () => {
    setUser(null);
  };

  const addToWatchlist = async (movie) => {
    if (!user) return;
    setUser(prev => ({
      ...prev,
      watchlist: [...prev.watchlist, movie],
    }));
  };

  const removeFromWatchlist = async (movieId) => {
    if (!user) return;
    setUser(prev => ({
      ...prev,
      watchlist: prev.watchlist.filter(movie => movie.id !== movieId),
    }));
  };

  const addUserPreference = async (preference) => {
    if (!user) return;
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...preference,
      },
    }));
  };

  const value = {
    user,
    login,
    register,
    logout,
    addToWatchlist,
    removeFromWatchlist,
    addUserPreference,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 