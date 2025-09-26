import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');

// Create axios instance with default config
const authAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class AuthService {
  // Register new user
  async register(userData) {
    try {
      const response = await authAPI.post('/auth/register', userData);
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return {
        success: true,
        data: response.data,
        user: response.data.user,
        token: response.data.token
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      };
    }
  }

  // Login user
  async login(identifier, password) {
    try {
      const response = await authAPI.post('/auth/login', {
        identifier,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return {
        success: true,
        data: response.data,
        user: response.data.user,
        token: response.data.token
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  }

  // Logout user
  async logout() {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await authAPI.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  // Get current user profile
  async getProfile() {
    try {
      const response = await authAPI.get('/auth/profile');
      return {
        success: true,
        user: response.data.user
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get profile'
      };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  // Get current user from localStorage
  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Get auth token
  getToken() {
    return localStorage.getItem('authToken');
  }

  // Search users
  async searchUsers(query) {
    try {
      const response = await authAPI.get(`/users/search?q=${encodeURIComponent(query)}`);
      return {
        success: true,
        users: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Search failed'
      };
    }
  }

  // Friend system methods
  async sendFriendRequest(userId) {
    try {
      const response = await authAPI.post('/friends/request', { userId });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to send friend request'
      };
    }
  }

  async respondToFriendRequest(friendshipId, action) {
    try {
      const response = await authAPI.post('/friends/respond', {
        friendshipId,
        action
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to respond to friend request'
      };
    }
  }

  async getFriends() {
    try {
      const response = await authAPI.get('/friends');
      return {
        success: true,
        friends: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get friends'
      };
    }
  }

  async getPendingRequests() {
    try {
      const response = await authAPI.get('/friends/pending');
      return {
        success: true,
        requests: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get pending requests'
      };
    }
  }

  async getFriendStats(friendId) {
    try {
      const response = await authAPI.get(`/friends/${friendId}/stats`);
      return {
        success: true,
        stats: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get friend stats'
      };
    }
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;

// Export the configured axios instance for other services
export { authAPI };
