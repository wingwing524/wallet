import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication and debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(new Error('Authentication required'));
    } else if (error.response?.status === 404) {
      throw new Error('Resource not found');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to server. Please make sure the backend is running.');
    }
    throw error;
  }
);

export const expenseService = {
  // Get all expenses
  async getExpenses(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.month) params.append('month', filters.month);
      if (filters.year) params.append('year', filters.year);
      if (filters.category) params.append('category', filters.category);
      
      const response = await api.get(`/expenses${params.toString() ? `?${params}` : ''}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch expenses: ${error.message}`);
    }
  },

  // Get expense by ID
  async getExpense(id) {
    try {
      const response = await api.get(`/expenses/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch expense: ${error.message}`);
    }
  },

  // Create new expense
  async createExpense(expenseData) {
    try {
      const response = await api.post('/expenses', expenseData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create expense: ${error.message}`);
    }
  },

  // Update expense
  async updateExpense(id, expenseData) {
    try {
      const response = await api.put(`/expenses/${id}`, expenseData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update expense: ${error.message}`);
    }
  },

  // Delete expense
  async deleteExpense(id) {
    try {
      const response = await api.delete(`/expenses/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete expense: ${error.message}`);
    }
  },

  // Get categories
  async getCategories() {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
  },

  // Get monthly summary
  async getMonthlySummary(year, month) {
    try {
      const response = await api.get(`/summary/${year}/${month}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch monthly summary: ${error.message}`);
    }
  },

  // Health check
  async healthCheck() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  }
};

export default api;
