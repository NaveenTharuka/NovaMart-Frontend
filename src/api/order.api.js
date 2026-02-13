// src/api/order.api.js
import axiosInstance from './axiosInstance';

export const getAllOrders = async () => {
    try {
        const response = await axiosInstance.get('/order/all');
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        return null;
    }
};

export const getOrderFromUserId = async (userId) => {
    try {
        const response = await axiosInstance.get(`/order/user/${userId}`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error loading user orders:", error);
        return {
            success: false,
            error: error.response?.data?.message || error.message
        };
    }
};

export const getOrderDetails = async (orderId) => {
    try {
        const response = await axiosInstance.get(`/order/${orderId}`);
        localStorage.removeItem("orderId");
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Failed to fetch order:", orderId, error);
        return {
            success: false,
            err: error.response?.data?.message || error.message
        };
    }
};

export const placeOrder = async (orderData) => {
    try {
        console.log('Placing single order:', orderData);
        const response = await axiosInstance.post('/order', orderData);

        // For empty responses (204 No Content)
        if (response.status === 204 || response.data === '') {
            return { success: true, status: response.status };
        }

        return { success: true, data: response.data, status: response.status };
    } catch (error) {
        console.error('Single Order API Error:', error);
        return {
            success: false,
            error: error.response?.data?.message || error.message,
            rawError: error
        };
    }
};

export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await axiosInstance.put('/order', { orderId, status });
        return { success: true };
    } catch (error) {
        console.error('Error in updateOrderStatus:', error);
        return {
            success: false,
            error: error.response?.data?.message || error.message
        };
    }
};

export const cancelOrder = async (orderId, reason = '') => {
    try {
        const response = await axiosInstance.put('/order', { orderId, status: 'CANCELED' });
        return { success: true };
    } catch (error) {
        console.error('Error in cancelOrder:', error);
        return {
            success: false,
            error: error.response?.data?.message || error.message
        };
    }
};

export const checkoutOrder = async (orderData) => {
    try {
        const response = await axiosInstance.post('/order/cartItem', orderData);

        // For empty responses
        if (response.status === 204 || response.data === '') {
            return {
                success: true,
                status: response.status,
                message: 'Order placed successfully'
            };
        }

        return { success: true, data: response.data, status: response.status };
    } catch (error) {
        console.error('Cart Order API Error:', error);
        return {
            success: false,
            error: error.response?.data?.message || error.message,
            rawError: error
        };
    }
};