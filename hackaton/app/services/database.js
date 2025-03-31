import { Platform } from 'react-native';

// For web, we'll use a REST API endpoint
const API_URL = process.env.AWS_API_GATEWAY_URL || 'http://localhost:3000/api';

class DatabaseService {
  constructor() {
    // Initialize any necessary state
  }

  // Helper function to make API calls
  async makeRequest(endpoint, method = 'GET', body = null) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User operations
  async createUser(email, password) {
    return this.makeRequest('/users', 'POST', { email, password });
  }

  async getUser(email, password) {
    return this.makeRequest('/users/login', 'POST', { email, password });
  }

  // Watchlist operations
  async addToWatchlist(userId, movie) {
    return this.makeRequest('/watchlist', 'POST', { userId, movie });
  }

  async getWatchlist(userId) {
    return this.makeRequest(`/watchlist/${userId}`);
  }

  async removeFromWatchlist(userId, movieId) {
    return this.makeRequest(`/watchlist/${userId}/${movieId}`, 'DELETE');
  }

  // User preferences operations
  async addUserPreference(userId, movie) {
    return this.makeRequest('/preferences', 'POST', { userId, movie });
  }

  async getUserPreferences(userId) {
    return this.makeRequest(`/preferences/${userId}`);
  }
}

export default new DatabaseService(); 