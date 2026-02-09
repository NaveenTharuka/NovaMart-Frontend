import { BASE_URL } from "@/api/axios";

export const CART_API = `${BASE_URL}/api/cart`;

export const getCart = async (userId) => {
    try {
        const res = await fetch(`${CART_API}/${userId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data?.message || "Failed to get cart");

        return { success: true, data };
    } catch (err) {
        return { success: false, error: err.message };
    }
};

export const addToCart = async (userId, productId, quantity = 1) => {
    try {
        const res = await fetch(`${CART_API}/${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, quantity }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to add to cart");

        return { success: true, data };
    } catch (err) {
        return { success: false, error: err.message };
    }
};

export const removeFromCartAPI = async (userId, productId) => {
    try {
        const res = await fetch(`${CART_API}/${userId}/${productId}`, {
            method: "DELETE",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to remove item");

        return { success: true, data };
    } catch (err) {
        return { success: false, error: err.message };
    }
};

export const updateCartItemAPI = async (userId, productId, quantity) => {
    try {
        const res = await fetch(`${CART_API}/${userId}/${productId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to update item");

        return { success: true, data };
    } catch (err) {
        return { success: false, error: err.message };
    }
};
