import { createContext, useContext, useState } from "react";
import { BASE_URL } from "@/api/axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    const CART_API = `${BASE_URL}/api/cart`;

    const fetchCart = async (userId) => {
        try {
            setLoading(true);
            const res = await fetch(`${CART_API}/${userId}`);

            if (!res.ok) throw new Error("Failed to fetch cart");

            const data = await res.json();
            setCart(data);
        } catch (err) {
            console.error("Fetch cart error:", err);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, quantity, userId) => {
        try {
            const res = await fetch(`${CART_API}/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, quantity }),
            });

            if (!res.ok) throw new Error("Failed to update quantity");

            setCart((prev) =>
                prev.map((item) =>
                    item.productId === productId
                        ? { ...item, quantity, subTotal: (item.subTotal / item.quantity) * quantity }
                        : item
                )
            );
        } catch (err) {
            console.error("Update quantity error:", err);
        }
    };

    const removeItem = async (productId, userId) => {
        try {
            const res = await fetch(`${CART_API}/${userId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId })
            });


            if (!res.ok) throw new Error("Failed to remove item");

            setCart((prev) => prev.filter((item) => item.productId !== productId));
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


