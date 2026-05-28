import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api', // Uses the Next.js rewrite proxy to reach the backend
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  // Try to get token from local storage (if running in browser)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default apiClient;
