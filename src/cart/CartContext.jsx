import { createContext, useContext, useState } from "react";
import useAuth from "../auth/UseAuth";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCart = async (userId) => {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:8080/api/cart/${userId}`);
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
            await fetch(`http://localhost:8080/api/cart/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, quantity }),
            });

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
            await fetch(`http://localhost:8080/api/cart/${userId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });
            setCart((prev) => prev.filter((item) => item.productId !== productId));
        } catch (err) {
            console.error("Remove item error:", err);
        }
    };

    return (
        <CartContext.Provider
            value={{ cart, loading, fetchCart, updateQuantity, removeItem }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
