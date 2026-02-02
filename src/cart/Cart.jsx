import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "@/auth/UseAuth";
import { useCart } from "./CartContext";
import Loader from "@/components/Loader/Loader";
import styles from "./Cart.module.css";

function Cart() {
    const { user } = useAuth();
    const { cart, fetchCart, updateQuantity, removeItem } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState(new Set());

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        const load = async () => {
            setLoading(true);
            await fetchCart(user.id);
            setLoading(false);
        };

        load();
    }, [user, navigate]);


    // Handle Selection
    const toggleSelection = (productId) => {
        setSelectedItems(prev => {
            const next = new Set(prev);
            if (next.has(productId)) {
                next.delete(productId);
            } else {
                next.add(productId);
            }
            return next;
        });
    };

    const toggleAll = () => {
        if (selectedItems.size === cart.length) {
            setSelectedItems(new Set());
        } else {
            const allIds = new Set(cart.map(item => item.productId));
            setSelectedItems(allIds);
        }
    };

    // Calculations
    const selectedCartItems = cart.filter(item => selectedItems.has(item.productId));
    const totalAmount = selectedCartItems.reduce((sum, item) => sum + item.subTotal, 0);

    const handleCheckout = () => {
        if (selectedCartItems.length === 0) return;

        // Pass selected items to OrderPage
        navigate('/orderpage/cart', {
            state: { products: selectedCartItems }
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center center-items mt-30" style={{ height: '80vh' }}>
                <Loader />
            </div>
        );
    }

    return (
        <div className={styles.cartContainer}>
            <div className={styles.cartList}>
                <div className={styles.cartHeader}>
                    <h2 className={styles.productName}>Shopping Cart ({cart.length})</h2>
                    {cart.length > 0 && (
                        <label className={styles.selectAllLabel}>
                            <input
                                type="checkbox"
                                checked={selectedItems.size === cart.length && cart.length > 0}
                                onChange={toggleAll}
                                className={styles.checkbox}
                            />
                            Select All
                        </label>
                    )}
                </div>

                {cart.length === 0 ? (
                    <div className={styles.emptyState}>
                        <h3 className={styles.summaryTitle}>Your cart is empty</h3>
                        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                            Looks like you haven't added any items to your cart yet.
                        </p>
                        <Link to="/products" className={styles.browseBtn}>Start Shopping</Link>
                    </div>
                ) : (
                    cart.map((item) => (
                        <div key={item.productId} className={styles.cartItemCard}>
                            {/* Checkbox */}
                            <div className={styles.checkboxContainer}>
                                <input
                                    type="checkbox"
                                    checked={selectedItems.has(item.productId)}
                                    onChange={() => toggleSelection(item.productId)}
                                    className={styles.checkbox}
                                />
                            </div>

                            {/* Image */}
                            <div className={styles.imageContainer}>
                                <img
                                    src={item.imageUrl || "https://picsum.photos/200"}
                                    alt={item.productName}
                                    className={styles.productImage}
                                    onError={(e) => (e.target.src = "/placeholder.png")}
                                />
                            </div>

                            {/* Details */}
                            <div className={styles.itemDetails}>
                                <h3 className={styles.productName}>{item.productName}</h3>
                                <div className={styles.priceInfo}>
                                    <span className={styles.itemTotal}>
                                        ${item.subTotal.toFixed(2)}
                                    </span>
                                    {item.quantity > 1 && (
                                        <span className={styles.unitPrice}>
                                            (${(item.subTotal / item.quantity).toFixed(2)} / item)
                                        </span>
                                    )}
                                </div>
                                <span className={`${styles.stockStatus} ${item.availability ? styles.inStock : styles.outStock}`}>
                                    {item.availability ? "In Stock" : "Out of Stock"}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className={styles.actionsContainer}>
                                <button
                                    className={styles.removeBtn}
                                    onClick={() => removeItem(item.productId, user.id)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    Remove
                                </button>

                                <div className={styles.quantityControls}>
                                    <button
                                        className={styles.qtyBtn}
                                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1), user.id)}
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className={styles.qtyValue}>{item.quantity}</span>
                                    <button
                                        className={styles.qtyBtn}
                                        onClick={() => updateQuantity(item.productId, item.quantity + 1, user.id)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Summary Panel */}
            {cart.length > 0 && (
                <div className={styles.summaryPanel}>
                    <h3 className={styles.summaryTitle}>Order Summary</h3>

                    <div className={styles.summaryRow}>
                        <span>Selected Items</span>
                        <span>{selectedCartItems.length}</span>
                    </div>

                    <div className={styles.totalRow}>
                        <span>Subtotal</span>
                        <span style={{ color: '#2563eb' }}>${totalAmount.toFixed(2)}</span>
                    </div>

                    <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                        Shipping & taxes calculated at checkout
                    </p>

                    <button
                        className={styles.checkoutBtn}
                        onClick={handleCheckout}
                        disabled={selectedCartItems.length === 0}
                    >
                        Checkout ({selectedCartItems.length})
                    </button>
                </div>
            )}
        </div>
    );
}

export default Cart;
