// src/api/user.api.js
import axiosInstance from './axiosInstance';

export const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get('/user/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        return null;
    }
};

export const updateUserRole = async (userId, newRole) => {
    try {
        const response = await axiosInstance.put('/user/role', { id: userId, role: newRole });
        return response.status === 200 || response.status === 204;
    } catch (error) {
        console.error('Error updating user role:', error);
        throw error;
    }
};