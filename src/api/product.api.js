// src/api/product.api.js
import axiosInstance from './axiosInstance';
import publicAxios from './publicAxios';

export const getAllProducts = async () => {
    try {
        const response = await publicAxios.get('/products/all');
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.message || error.message };
    }
};

export const fetchProductByOrderItemId = async (orderItemId) => {
    try {
        const response = await axiosInstance.get(`/products/order/${orderItemId}`);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.message || error.message };
    }
};

export const fetchProductById = async (id) => {
    try {
        const response = await publicAxios.get(`/products/id/${id}`);
        const data = response.data;
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            price: parseFloat(data.price),
            imageUrl: data.imgUrl,
            category: data.category || '',
            quantity: data.quantity,
            rating: data.rating || 0,
            reviews: data.reviews || [],
        };
    } catch (error) {
        return { success: false, error: error.response?.data?.message || error.message };
    }
};

export const addProduct = async (product) => {
    try {
        const response = await axiosInstance.post('/products', product);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.message || error.message };
    }
};

export const updateProduct = async (product) => {
    try {
        const response = await axiosInstance.put(`/products/update`, product);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.message || error.message };
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await axiosInstance.delete(`/products/id/${id}`);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.message || error.message };
    }
};
