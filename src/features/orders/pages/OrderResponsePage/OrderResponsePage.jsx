import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderDetails } from '@/api/order.api';
import Loader from '@/components/Loader/Loader';
import styles from './OrderResponsePage.module.css';

const OrderResponsePage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) return;

            try {
                setLoading(true);
                const response = await getOrderDetails(orderId);

                if (response.success && response.data) {
                    setOrder(response.data);
                } else {
                    setError('Order not found or could not be loaded.');
                }
            } catch (err) {
                console.error('Error fetching order:', err);
                setError('An error occurred while loading order details.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Loader />
                <p>Loading your order receipt...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.card}>
                    <div className={styles.errorContainer}>
                        <div className={styles.successIcon} style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
                            ⚠️
                        </div>
                        <h2>Oops! Something went wrong</h2>
                        <p>{error || 'We could not find the order you are looking for.'}</p>
                        <div className={styles.actions}>
                            <button className={`${styles.button} ${styles.primaryButton}`} onClick={() => navigate('/')}>
                                Return Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Determine status color
    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'DELIVERED': return '#16a34a'; // Green
            case 'COMPLETED': return '#16a34a'; // Green
            case 'PENDING': return '#ca8a04'; // Yellow
            case 'CANCELLED': return '#dc2626'; // Red
            default: return '#3b82f6'; // Blue
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.card}>
                <div className={styles.successHeader}>
                    <div className={styles.successIcon}>✓</div>
                    <h1 className={styles.title}>Thank You for Your Order!</h1>
                    <p className={styles.subtitle}>Your order has been placed successfully.</p>
                </div>

                <div className={styles.orderInfo}>
                    <div>
                        <div className={styles.label}>Order Number</div>
                        <div className={styles.orderId}>#{order.orderId || order.id}</div>
                    </div>
                    <div>
                        <div className={styles.label} style={{ textAlign: 'right' }}>Status</div>
                        <div style={{ color: getStatusColor(order.orderStatus || order.status), fontWeight: 'bold' }}>
                            {order.orderStatus || order.status}
                        </div>
                    </div>
                </div>

                <div className={styles.detailsGrid}>
                    <div className={styles.detailBox}>
                        <h3 className={styles.sectionTitle}>📍 Shipping Details</h3>
                        <p className={styles.detailValue}>
                            {order.shippingAddress || order.address || (
                                <span>
                                    {order.customerName}<br />
                                    {order.customerEmail}
                                </span>
                            )}
                        </p>
                    </div>
                    <div className={styles.detailBox}>
                        <h3 className={styles.sectionTitle}>📝 Order Info</h3>
                        <p className={styles.detailLabel}>Date</p>
                        <p className={styles.detailValue}>
                            {order.orderDate ? new Date(order.orderDate).toLocaleString() : new Date().toLocaleString()}
                        </p>
                        {order.comment && (
                            <>
                                <p className={styles.detailLabel} style={{ marginTop: '0.5rem' }}>Note</p>
                                <p className={styles.detailValue}>{order.comment}</p>
                            </>
                        )}
                    </div>
                </div>

                <div className={styles.sectionTitle}>📦 Order Items</div>
                <div className={styles.itemList}>
                    {(order.orderItems || order.products)?.map((item, index) => (
                        <div key={index} className={styles.item}>
                            <img
                                src={item.imageUrl || "https://picsum.photos/100"}
                                alt={item.productName || item.name}
                                className={styles.itemImage}
                                onError={(e) => { e.target.src = "https://picsum.photos/100" }}
                            />
                            <div className={styles.itemDetails}>
                                <div className={styles.itemName}>{item.productName || item.name}</div>
                                <div className={styles.itemMeta}>Qty: {item.quantity}</div>
                            </div>
                            <div className={styles.itemPrice}>
                                Rs {item.price ? item.price : (item.unitPrice ? item.unitPrice * item.quantity : 0).toFixed(2)}
                            </div>
                        </div>
                    ))}
                    {(!order.orderItems && !order.products) && (
                        <div className={styles.item}>No items found in this order.</div>
                    )}
                </div>

                <div className={styles.summarySection}>
                    <div className={styles.totalRow}>
                        <span>Total Amount</span>
                        <span>Rs {order.orderTotal ? order.orderTotal.toFixed(2) : (order.totalAmount ? order.totalAmount.toFixed(2) : '0.00')}</span>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button className={`${styles.button} ${styles.secondaryButton}`} onClick={() => navigate('/products')}>
                        Continue Shopping
                    </button>
                    <button className={`${styles.button} ${styles.primaryButton}`} onClick={() => navigate('/myOrders/' + order.user?.id)}>
                        View My Orders
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderResponsePage;
