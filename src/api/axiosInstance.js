// src/api/axiosInstance.js
import axios from 'axios';
import { BASE_URL } from './axios';

const axiosInstance = axios.create({
    baseURL: `${BASE_URL}/api`,
    headers: { 'Content-Type': 'application/json' },
});

const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

let isHandlingAuthError = false;

// Attach token for all requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();
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
        // Handle network errors
        if (!error.response) {
            console.error('[Axios] Network error:', error.message);
            return Promise.reject(error);
        }

        if (error.response.status === 401 && !isHandlingAuthError) {
            isHandlingAuthError = true;

            console.warn('[Axios] 401 Unauthorized:', error.config?.url);

            localStorage.removeItem('token');
            sessionStorage.removeItem('token');

            // Dispatch event for UI layer to handle gracefully
            window.dispatchEvent(new CustomEvent('auth:sessionExpired', {
                detail: { url: error.config?.url }
            }));

            // Optional: hard redirect as fallback
            // window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;