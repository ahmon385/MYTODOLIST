import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  signup: (username, email, password) =>
    api.post('/auth/signup', { username, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  getMe: () =>
    api.get('/auth/me'),
};

// Todo API
export const todoAPI = {
  getAll: () =>
    api.get('/todos'),
  create: (title, description) =>
    api.post('/todos', { title, description }),
  update: (id, data) =>
    api.put(`/todos/${id}`, data),
  delete: (id) =>
    api.delete(`/todos/${id}`),
};

export default api;
