import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "@/features/auth/hooks/useAuth";
import { useCart } from "../context/CartContext";
import Loader from "../../../components/Loader/Loader";
import styles from "./Cart.module.css";

function Cart() {
    const { user } = useAuth();
    const { cart, fetchCart, updateQuantity, removeItem } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState(new Set());

    // Ensure cart is always an array
    const cartItems = useMemo(() => {
        return Array.isArray(cart) ? cart : [];
    }, [cart]);

    useEffect(() => {
        const load = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                await fetchCart(user.id);
            } catch (error) {
                console.error("Failed to fetch cart:", error);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [user, fetchCart]);

    // Handle Selection
    const toggleSelection = useCallback((productId) => {
        setSelectedItems(prev => {
            const next = new Set(prev);
            if (next.has(productId)) {
                next.delete(productId);
            } else {
                // Only allow selection of available items
                const item = cartItems.find(item => item.productId === productId);
                if (!item?.availability) {
                    return prev;
                }
                next.add(productId);
            }
            return next;
        });
    }, [cartItems]);

    const toggleAll = useCallback(() => {
        const availableItems = cartItems.filter(item => item.availability);

        // If all available items are already selected, deselect all
        const allAvailableIds = new Set(availableItems.map(item => item.productId));
        const allAvailableSelected = availableItems.length > 0 &&
            availableItems.every(item => selectedItems.has(item.productId));

        if (allAvailableSelected) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(allAvailableIds);
        }
    }, [cartItems, selectedItems]);

    // Calculations
    const selectedCartItems = useMemo(() =>
        cartItems.filter(item => selectedItems.has(item.productId)),
        [cartItems, selectedItems]
    );

    const availableItems = useMemo(() =>
        cartItems.filter(item => item.availability),
        [cartItems]
    );

    const totalAmount = useMemo(() =>
        selectedCartItems.reduce((sum, item) => sum + (item.subTotal || 0), 0),
        [selectedCartItems]
    );

    const handleCheckout = useCallback(() => {
        if (selectedCartItems.length === 0) return;

        // Pass selected items to OrderPage
        navigate('/orderpage/cart', {
            state: { products: selectedCartItems }
        });
    }, [navigate, selectedCartItems]);

    // Handle quantity update
    const handleUpdateQuantity = useCallback(async (productId, newQuantity) => {
        if (!user?.id) return;

        try {
            await updateQuantity(productId, newQuantity, user.id);
        } catch (error) {
            console.error("Failed to update quantity:", error);
        }
    }, [user, updateQuantity]);

    // Handle item removal
    const handleRemoveItem = useCallback(async (productId) => {
        if (!user?.id) return;

        try {
            await removeItem(productId, user.id);
            // Remove from selected items if it was selected
            setSelectedItems(prev => {
                const next = new Set(prev);
                next.delete(productId);
                return next;
            });
        } catch (error) {
            console.error("Failed to remove item:", error);
        }
    }, [user, removeItem]);

    // Show loading state
    if (loading) {
        return (
            <div className="flex justify-center center-items mt-30" style={{ height: '80vh' }}>
                <Loader />
            </div>
        );
    }

    // If cart is empty, show centered empty state
    if (cartItems.length === 0) {
        return (
            <div className={styles.cartContainer}>
                <div className={styles.emptyState} style={{ gridColumn: '1 / -1' }}>
                    <h3 className={styles.summaryTitle}>Your cart is empty</h3>
                    <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                        Looks like you haven't added any items to your cart yet.
                    </p>
                    <Link to="/products" className={styles.browseBtn}>Start Shopping</Link>
                </div>
            </div>
        );
    }

    // Cart has items - show normal layout
    return (
        <div className={styles.cartContainer}>
            <div className={styles.cartList}>
                <div className={styles.cartHeader}>
                    <h2 className={styles.productName}>Shopping Cart ({cartItems.length})</h2>
                    {cartItems.length > 0 && availableItems.length > 0 && (
                        <label className={styles.selectAllLabel}>
                            <input
                                type="checkbox"
                                checked={availableItems.length > 0 &&
                                    availableItems.every(item => selectedItems.has(item.productId))}
                                onChange={toggleAll}
                                className={styles.checkbox}
                            />
                            Select All ({availableItems.length} available)
                        </label>
                    )}
                </div>

                {cartItems.map((item) => (
                    <div key={item.productId} className={styles.cartItemCard}>
                        {/* Checkbox */}
                        <div className={styles.checkboxContainer}>
                            <input
                                type="checkbox"
                                checked={selectedItems.has(item.productId)}
                                onChange={() => toggleSelection(item.productId)}
                                className={styles.checkbox}
                                disabled={!item.availability}
                            />
                        </div>

                        {/* Image */}
                        <div className={styles.imageContainer}>
                            <img
                                src={item.imgUrl || "https://picsum.photos/200"}
                                alt={item.productName || "Product"}
                                className={styles.productImage}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/placeholder.png";
                                }}
                            />
                        </div>

                        {/* Details */}
                        <div className={styles.itemDetails}>
                            <h3 className={styles.productName}>{item.productName || "Unknown Product"}</h3>
                            <div className={styles.priceInfo}>
                                <span className={styles.itemTotal}>
                                    ${(item.subTotal || 0).toFixed(2)}
                                </span>
                                {item.quantity > 1 && (
                                    <span className={styles.unitPrice}>
                                        (${((item.subTotal || 0) / (item.quantity || 1)).toFixed(2)} / item)
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
                                onClick={() => handleRemoveItem(item.productId)}
                                aria-label={`Remove ${item.productName || "item"} from cart`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                                Remove
                            </button>

                            <div className={styles.quantityControls} role="group" aria-label={`Quantity controls for ${item.productName || "item"}`}>
                                <button
                                    className={styles.qtyBtn}
                                    onClick={() => handleUpdateQuantity(item.productId, Math.max(1, (item.quantity || 1) - 1))}
                                    disabled={!item.availability || (item.quantity || 1) <= 1}
                                    aria-label="Decrease quantity"
                                >
                                    -
                                </button>
                                <span className={styles.qtyValue}>{item.quantity || 1}</span>
                                <button
                                    className={styles.qtyBtn}
                                    onClick={() => handleUpdateQuantity(item.productId, (item.quantity || 1) + 1)}
                                    disabled={!item.availability}
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary Panel */}
            <div className={cartItems.length > 0 ? styles.summaryPanel : styles.summeryHidden}>
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
        </div>
    );
}

export default Cart;