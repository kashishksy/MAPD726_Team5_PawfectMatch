// @ts-nocheck

import axios from 'axios';
import { Platform } from 'react-native';
import { getToken } from '../utils/authStorage';

// Add this before creating the axios instance
const getAuthHeader = async () => {
  const token = await getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const api = axios.create({
  baseURL: 'https://mapd726-team5-pawfectmatch.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  async (config) => {
    const authHeader = await getAuthHeader();
    config.headers = {
      ...config.headers,
      ...authHeader,
    };
    console.log('Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.log('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.data);
    return response;
  },
  (error) => {
    console.log('Response Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

export default api; 