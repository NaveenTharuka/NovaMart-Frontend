// src/cart/cart.api.js
import axios from "axios";

const API_BASE = "http://localhost:8080/api/cart";

export const getCart = async (userId) => {
    try {
        const res = await axios.get(`${API_BASE}/${userId}`);
        return { success: true, data: res.data };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const addToCart = async (userId, productId, quantity = 1) => {
    try {
        const res = await axios.post(`${API_BASE}/${userId}`, { productId, quantity });
        return { success: true, data: res.data };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const removeFromCartAPI = async (userId, productId) => {
    try {
        const res = await axios.delete(`${API_BASE}/${userId}/${productId}`);
        return { success: true, data: res.data };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const updateCartItemAPI = async (userId, productId, quantity) => {
    try {
        const res = await axios.put(`${API_BASE}/${userId}/${productId}`, { quantity });
        return { success: true, data: res.data };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};
