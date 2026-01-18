// src/auth/auth.api.js
import axios from "axios";

const API_BASE = "http://localhost:8080/api/user"; // backend base URL

export const login = async ({ email, password }) => {
    try {
        const res = await axios.post(`${API_BASE}/login`, { email, password });
        return { success: true, data: res.data };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};

export const register = async ({ email, password }) => {
    try {
        const res = await axios.post(`${API_BASE}/register`, { email, password });
        return { success: true, data: res.data };
    } catch (err) {
        return { success: false, error: err.response?.data?.message || err.message };
    }
};
