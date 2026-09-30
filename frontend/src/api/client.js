import axios from 'axios';

// Get token from local storage if needed
const getToken = () => localStorage.getItem('token');

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://roadshare-ai-2.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to add auth token
apiClient.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));
