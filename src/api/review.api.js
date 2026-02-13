// src/api/review.api.js
import axiosInstance from './axiosInstance';

export const getAllReviews = async () => {
    try {
        const response = await axiosInstance.get('/review');
        return response.data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        throw error;
    }
};

export const addReview = async (userId, productId, rating, comment) => {
    try {
        const response = await axiosInstance.post('/review', { userId, productId, rating, comment });

        // Handle empty responses
        if (response.status === 204 || response.data === '') {
            return { success: true };
        }

        return response.data;
    } catch (error) {
        console.error("Error adding review:", error);
        throw error;
    }
};