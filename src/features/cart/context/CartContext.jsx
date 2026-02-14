import { createContext, useContext, useState, useCallback, useRef } from "react";
import { getCart, removeFromCartAPI, updateCartItemAPI } from "@/api/cart.api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const fetchInProgress = useRef(false);
    const updateInProgress = useRef(false);

    const fetchCart = useCallback(async (userId) => {
        // Prevent multiple simultaneous fetches
        if (fetchInProgress.current || !userId) return;

        fetchInProgress.current = true;
        setLoading(true);

        try {
            const res = await getCart(userId);
            if (res.success) {
                // Only update if data is different
                setCart(prevCart => {
                    // Compare to prevent unnecessary updates
                    if (JSON.stringify(prevCart) === JSON.stringify(res.data)) {
                        return prevCart;
                    }
                    return res.data;
                });
            }
        } catch (err) {
            console.error("Fetch cart error:", err);
        } finally {
            setLoading(false);
            fetchInProgress.current = false;
        }
    }, []);

    const updateQuantity = useCallback(async (productId, quantity, userId) => {
        if (!userId || updateInProgress.current) return;

        // Optimistically update UI
        setCart(prevCart =>
            prevCart.map(item =>
                item.productId === productId
                    ? { ...item, quantity, subTotal: (item.price || item.subTotal / item.quantity) * quantity }
                    : item
            )
        );

        updateInProgress.current = true;

        try {
            const res = await updateCartItemAPI(userId, productId, quantity);
            if (!res.success) {
                // Revert on failure
                await fetchCart(userId);
            }
        } catch (err) {
            console.error("Update quantity error:", err);
            // Revert on error
            await fetchCart(userId);
        } finally {
            updateInProgress.current = false;
        }
    }, [fetchCart]);

    const removeItem = useCallback(async (productId, userId) => {
        if (!userId) return;

        // Store item for potential revert
        const removedItem = cart.find(item => item.productId === productId);

        // Optimistically update UI
        setCart(prevCart => prevCart.filter(item => item.productId !== productId));

        try {
            const res = await removeFromCartAPI(userId, productId);
            if (!res.success) {
                // Revert on failure
                setCart(prevCart => [...prevCart, removedItem].sort((a, b) => a.productId - b.productId));
                await fetchCart(userId);
            }
        } catch (err) {
            console.error("Remove item error:", err);
            // Revert on error
            setCart(prevCart => [...prevCart, removedItem].sort((a, b) => a.productId - b.productId));
            await fetchCart(userId);
        }
    }, [cart, fetchCart]);

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            fetchCart,
            updateQuantity,
            removeItem
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};