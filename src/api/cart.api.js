// src/api/cart.api.js
import axiosInstance from './axiosInstance';

export const getCart = async (userId) => {
    try {
        const response = await axiosInstance.get(`/cart/${userId}`);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message
        };
    }
};

export const addToCart = async (userId, productId, quantity = 1) => {
    try {
        const response = await axiosInstance.post(`/cart/${userId}`, { productId, quantity });
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message
        };
    }
};

export const removeFromCartAPI = async (userId, productId) => {
    try {
        const response = await axiosInstance.delete(`/cart/${userId}`, { data: { productId } });
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message
        };
    }
};

export const updateCartItemAPI = async (userId, productId, quantity) => {
    try {
        const response = await axiosInstance.put(`/cart/${userId}`, { productId, quantity });
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message
        };
    }
};