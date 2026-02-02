import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './OrderPage.module.css';
import useAuth from '@/auth/UseAuth';
import Loader from '@/components/Loader/Loader';

// ============================================
// API CONFIGURATION
// ============================================
const API_BASE_URL = 'http://localhost:8080';

// Fetch product by ID
const fetchProductById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products/id/${id}`);
        if (!response.ok) {
            throw new Error(`Product not found (Status: ${response.status})`);
        }
        const data = await response.json();

        return {
            id: data.id,
            name: data.name,
            description: data.description,
            price: parseFloat(data.price),
            imageUrl: data.imageUrl,
            category: data.category || '',

        };
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Place order function
const placeOrder = async (orderData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error(`Order failed (Status: ${response.status})`);
        }

        return await response.json();
    } catch (error) {
        console.error('Order API Error:', error);
        throw error;
    }
};

const OrderPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    // State
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderItems, setOrderItems] = useState([]);
    const [error, setError] = useState(null);

    const [shippingInfo, setShippingInfo] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: user?.city || '',
        state: user?.state || '',
        zipCode: user?.zipCode || '',
        country: user?.country || 'Sri Lanka'
    });

    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [orderNotes, setOrderNotes] = useState('');

    const shippingOptions = [
        { id: 'standard', name: 'Standard Delivery', description: '5-7 business days', cost: 150, icon: '🚚' },
        { id: 'express', name: 'Express Delivery', description: '2-3 business days', cost: 300, icon: '⚡' },
        { id: 'pickup', name: 'Store Pickup', description: 'Pick up from nearest store', cost: 0, icon: '🏪' }
    ];

    const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0].id);

    // Load Product
    useEffect(() => {
        const loadProduct = async () => {
            try {
                setIsLoading(true);
                setError(null);

                if (location.state?.products) {
                    // Multi-item order from Cart
                    const items = location.state.products.map(p => ({
                        ...p,
                        id: p.productId || p.id, // Ensure ID is consistent
                        name: p.productName || p.name,
                        price: p.subTotal ? (p.subTotal / p.quantity) : p.price,
                        imageUrl: p.imageUrl,
                        quantity: p.quantity || 1
                    }));
                    setOrderItems(items);
                } else if (location.state?.product) {
                    // Single item from Buy Now
                    const p = location.state.product;
                    setOrderItems([{
                        ...p,
                        quantity: 1
                    }]);
                } else if (id) {
                    // Single item from URL params
                    const productData = await fetchProductById(id);
                    setOrderItems([{
                        ...productData,
                        quantity: 1
                    }]);
                } else {
                    throw new Error('No items selected for checkout');
                }

            } catch (err) {
                console.error('Failed to load product:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        loadProduct();
    }, [id, location.state]);

    // Calculations
    const selectedShippingOption = shippingOptions.find(opt => opt.id === selectedShipping);

    const itemsSubtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = selectedShippingOption ? selectedShippingOption.cost : 0;
    const taxRate = 0.13;
    const taxAmount = itemsSubtotal * taxRate;
    const totalAmount = itemsSubtotal + shippingCost + taxAmount;

    // Handlers
    const handleQuantityChange = (index, change) => {
        setOrderItems(prev => {
            const newItems = [...prev];
            const item = newItems[index];
            const newQty = Math.max(1, item.quantity + change);

            // Check stock if available
            if (item.stock && item.stock < newQty) {
                // Ideally show error per item, for now we just cap it
                return prev;
            }

            newItems[index] = { ...item, quantity: newQty };
            return newItems;
        });
    };

    const handleShippingInfoChange = (field, value) => {
        setShippingInfo(prev => ({ ...prev, [field]: value }));
    };

    const handlePlaceOrder = async () => {
        if (!user) {
            alert('Please login to place an order');
            navigate('/login');
            return;
        }

        if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            const address = `${shippingInfo.phone}, ${shippingInfo.fullName}, ${shippingInfo.address}, ${shippingInfo.country}`;

            if (!address) {
                alert('Invalid address');
                return;
            }

            // Loop through all items and place orders individually
            const promises = orderItems.map(item => {
                const orderData = {
                    userId: user.id || "guest",
                    productId: item.id,
                    quantity: item.quantity,
                    address: address,
                    comment: `Product: ${item.name}, Quantity: ${item.quantity}. ` +
                        `Shipping: ${address}. ` +
                        `Notes: ${orderNotes}`
                };
                return placeOrder(orderData);
            });

            await Promise.all(promises);

            alert(`🎉 Order(s) Placed Successfully! Total: Rs ${totalAmount.toFixed(2)}`);
            navigate('/');

        } catch (err) {
            console.error('Order submission failed:', err);
            alert(`❌ One or more orders failed: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className={styles.loaderContainer}><Loader /><p>Loading order details...</p></div>;

    if (error && orderItems.length === 0) return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h2>Order Error</h2>
                    <p>{error}</p>
                    <button className={styles.payButton} onClick={() => navigate('/products')} style={{ width: 'auto', marginTop: '1rem' }}>
                        Browse Products
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className={styles.pageContainer}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Complete Your Purchase</h1>
                    <p className={styles.subtitle}>Review your order and enter shipping details</p>
                </div>
                <div className={styles.stepsContainer}>
                    <div className={`${styles.step} ${styles.stepActive}`}>
                        <div className={styles.stepNumber}>1</div>
                        <span className={styles.stepLabel}>Details</span>
                    </div>
                    <div className={`${styles.step} ${styles.stepActive}`}>
                        <div className={styles.stepNumber}>2</div>
                        <span className={styles.stepLabel}>Shipping</span>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>3</div>
                        <span className={styles.stepLabel}>Payment</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <div className={styles.leftColumn}>

                    {/* Product Card */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>
                                <span className={styles.cardIcon}>📦</span> Product Details
                            </h2>
                        </div>
                        <div className={styles.cardBody}>
                            {orderItems.map((item, index) => (
                                <div key={index} className={styles.productDetails} style={{ paddingBottom: '1rem', marginBottom: '1rem', borderBottom: index < orderItems.length - 1 ? '1px solid #eee' : 'none' }}>
                                    <img
                                        src={item.imageUrl ? item.imageUrl : "https://picsum.photos/300/200"}
                                        alt={item.name}
                                        className={styles.productImage}
                                    />
                                    <div className={styles.productInfo}>
                                        <h3 className={styles.productName}>{item.name}</h3>
                                        <p className={styles.productDesc}>{item.description?.substring(0, 100)}...</p>

                                        <div className={styles.productMeta}>
                                            <div className={styles.price}>Rs {item.price.toFixed(2)}</div>
                                            <div className={styles.quantityControl}>
                                                <button
                                                    className={styles.qtyBtn}
                                                    onClick={() => handleQuantityChange(index, -1)}
                                                    disabled={item.quantity <= 1 || isSubmitting}
                                                >-</button>
                                                <span className={styles.qtyValue}>{item.quantity}</span>
                                                <button
                                                    className={styles.qtyBtn}
                                                    onClick={() => handleQuantityChange(index, 1)}
                                                    disabled={isSubmitting}
                                                >+</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>
                                <span className={styles.cardIcon}>📍</span> Shipping Information
                            </h2>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Full Name *</label>
                                    <input
                                        className={styles.input}
                                        value={shippingInfo.fullName}
                                        onChange={(e) => handleShippingInfoChange('fullName', e.target.value)}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Phone Number *</label>
                                    <input
                                        className={styles.input}
                                        value={shippingInfo.phone}
                                        onChange={(e) => handleShippingInfoChange('phone', e.target.value)}
                                        placeholder="+977..."
                                    />
                                </div>
                                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                    <label className={styles.label}>Address *</label>
                                    <input
                                        className={styles.input}
                                        value={shippingInfo.address}
                                        onChange={(e) => handleShippingInfoChange('address', e.target.value)}
                                        placeholder="Street Address"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>City *</label>
                                    <input
                                        className={styles.input}
                                        value={shippingInfo.city}
                                        onChange={(e) => handleShippingInfoChange('city', e.target.value)}
                                        placeholder="Kathmandu"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Country</label>
                                    <input
                                        className={styles.input}
                                        value={shippingInfo.country}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Method */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>
                                <span className={styles.cardIcon}>🚚</span> Shipping Method
                            </h2>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.shippingOptions}>
                                {shippingOptions.map(option => (
                                    <div
                                        key={option.id}
                                        className={`${styles.optionCard} ${selectedShipping === option.id ? styles.optionCardSelected : ''}`}
                                        onClick={() => setSelectedShipping(option.id)}
                                    >
                                        <div className={styles.optionInfo}>
                                            <span className={styles.optionIcon}>{option.icon}</span>
                                            <div className={styles.optionText}>
                                                <h4>{option.name}</h4>
                                                <p>{option.description}</p>
                                            </div>
                                        </div>
                                        <div className={styles.optionPrice}>
                                            {option.cost === 0 ? 'Free' : `Rs ${option.cost}`}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>
                                <span className={styles.cardIcon}>💳</span> Payment Method
                            </h2>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.shippingOptions}>
                                <div className={`${styles.optionCard} ${paymentMethod === 'cash' ? styles.optionCardSelected : ''}`} onClick={() => setPaymentMethod('cash')}>
                                    <div className={styles.optionInfo}>
                                        <span className={styles.optionIcon}>💵</span>
                                        <div className={styles.optionText}>
                                            <h4>Cash on Delivery</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className={`${styles.optionCard} ${paymentMethod === 'bank' ? styles.optionCardSelected : ''}`} onClick={() => setPaymentMethod('bank')}>
                                    <div className={styles.optionInfo}>
                                        <span className={styles.optionIcon}>🏦</span>
                                        <div className={styles.optionText}>
                                            <h4>Bank Transfer</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Summary */}
                <div className={styles.rightColumn}>
                    <div className={`${styles.card} ${styles.summaryCard}`}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>
                                <span className={styles.cardIcon}>🧾</span> Order Summary
                            </h2>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>Rs {itemsSubtotal.toFixed(2)}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Shipping</span>
                                <span>Rs {shippingCost.toFixed(2)}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Tax (13%)</span>
                                <span>Rs {taxAmount.toFixed(2)}</span>
                            </div>

                            <div className={styles.totalRow}>
                                <span>Total</span>
                                <span style={{ color: '#3b82f6' }}>Rs {totalAmount.toFixed(2)}</span>
                            </div>

                            <button
                                className={styles.payButton}
                                onClick={handlePlaceOrder}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Processing...' : `Pay Rs ${totalAmount.toFixed(2)}`}
                            </button>

                            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                                🔒 Secure SSL Encryption
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OrderPage;