import { createContext, useContext, useState } from "react";
import { getCart, removeFromCartAPI, updateCartItemAPI } from "@/api/cart.api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCart = async (userId) => {
        try {
            setLoading(true);
            const res = await getCart(userId);

            if (res.success) {
                setCart(res.data);
            } else {
                throw new Error(res.error || "Failed to fetch cart");
            }
        } catch (err) {
            console.error("Fetch cart error:", err);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, quantity, userId) => {
        // console.log(`[CartContext] Updating: user=${userId}, product=${productId}, qty=${quantity}`);
        try {
            if (!userId) {
                console.error("[CartContext] updateQuantity aborted: userId is missing");
                return;
            }
            const res = await updateCartItemAPI(userId, productId, quantity);

            if (res.success) {
                setCart(res.data);
            } else {
                throw new Error(res.error || "Failed to update quantity");
            }
        } catch (err) {
            console.error("Update quantity error:", err);
        }
    };

    const removeItem = async (productId, userId) => {
        // console.log(`[CartContext] Removing: user=${userId}, product=${productId}`);
        try {
            if (!userId) {
                console.error("[CartContext] removeItem aborted: userId is missing");
                return;
            }
            const res = await removeFromCartAPI(userId, productId);

            if (res.success) {
                setCart(res.data);
            } else {
                throw new Error(res.error || "Failed to remove item");
            }
        } catch (err) {
            console.error("Remove item error:", err);
        }
    };

    return (
        <CartContext.Provider value={{ cart, loading, fetchCart, updateQuantity, removeItem }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);


