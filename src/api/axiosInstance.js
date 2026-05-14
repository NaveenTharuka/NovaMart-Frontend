// src/api/axiosInstance.js
import axios from 'axios';
import { BASE_URL } from './axios';

const axiosInstance = axios.create({
    baseURL: `${BASE_URL}/api`,
    headers: { 'Content-Type': 'application/json' },
});

// Attach token for all requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Global response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn('[Axios] 401 Unauthorized', error.config?.url);
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            alert('Session expired. Please log in again.');
            // AuthContext / ProtectedRoute will handle actual redirect
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
