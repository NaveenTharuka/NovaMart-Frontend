// src/api/axiosInstance.js
import axios from 'axios';
import { BASE_URL } from './axios';



const axiosInstance = axios.create({
    baseURL: `${BASE_URL}/api`,
    timeout: 30000, // 30 second timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request timestamp for debugging
        config.metadata = { startTime: new Date() };

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Log request duration in development
        if (process.env.NODE_ENV === 'development' && response.config.metadata) {
            const duration = new Date() - response.config.metadata.startTime;
            console.log(`[API] ${response.config.url} - ${duration}ms`);
        }
        return response;
    },
    (error) => {
        // Handle different error status codes
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    handleUnauthorized(error);
                    break;
                case 403:
                    console.error('Forbidden access');
                    break;
                case 404:
                    console.warn('Resource not found', error.config?.url);
                    break;
                case 500:
                    console.error('Server error');
                    break;
                default:
                    console.error(`HTTP ${error.response.status}:`, error.message);
            }
        } else if (error.request) {
            console.error('No response received from server');
        } else {
            console.error('Request setup error:', error.message);
        }

        return Promise.reject(error);
    }
);

function handleUnauthorized(error) {
    const token = localStorage.getItem('token');
    if (token && !window.location.pathname.includes('/login')) {
        console.warn('[Auth] Session expired');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
}

export default axiosInstance;