// src/api/category.api.js
import publicAxios from './publicAxios';

export const fetchCategories = async () => {
    try {
        const response = await publicAxios.get('/categories/all');
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Fetching error: Categories", error);
        return {
            success: false,
            err: error.response?.data?.message || error.message
        };
    }
};