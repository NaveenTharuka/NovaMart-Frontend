// src/api/auth.api.js
import axiosInstance from './axiosInstance';
import publicAxios from './publicAxios';

export const login = async ({ email, password }) => {
    try {
        const response = await axiosInstance.post('/user/login', { email, password });
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message
        };
    }
};

export const register = async ({ email, password, userName, address, phoneNumber, role }) => {
    try {
        const response = await axiosInstance.post('/user/register', {
            email, password, userName, address, phoneNumber, role
        });
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message
        };
    }
};

export const verifyToken = async (token) => {
    try {
        const response = await publicAxios.post('/user/isTokenExpired', { token });
        return { success: !response.data };
    } catch {
        return { success: false };
    }
};