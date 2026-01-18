import { use, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../auth/UseAuth";
import { useCart } from "./CartContext";
import "./Cart.css";

function Cart() {
    const { user } = useAuth();
    const { cart, loading, fetchCart, updateQuantity, removeItem } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        fetchCart(user.id);
    }, [user, navigate]);

    if (loading) return <p>Loading cart...</p>;

    return (
        <div className="cart-container">
            <h2 className="cart-title">Shopping Cart</h2>

            {cart.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <div className="cart-list">
                    {cart.map((item) => (
                        <div key={item.productId} className="cart-card">
                            <img
                                src={item.imageUrl || "https://picsum.photos/800"}
                                alt={item.productName}
                                className="cart-image"
                                onError={(e) => (e.target.src = "/placeholder.png")}
                            />

                            <div className="cart-info">
                                <h3>{item.productName}</h3>
                                <p>Subtotal: ${item.subTotal.toFixed(2)}</p>
                                <p className={item.availability ? "in-stock" : "out-stock"}>
                                    {item.availability ? "In Stock" : "Out of Stock"}
                                </p>

                                <div className="cart-actions">
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            updateQuantity(item.productId, Number(e.target.value), user.id)
                                        }
                                    />
                                    <button onClick={() => removeItem(item.productId, user.id)}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Cart;
