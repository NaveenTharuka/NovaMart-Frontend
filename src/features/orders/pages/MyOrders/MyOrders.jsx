import styles from './MyOrders.module.css';
import { getOrderFromUserId } from '@/api/order.api';
import { useEffect, useState, useCallback, useRef } from 'react';
import useAuth from "../../../auth/hooks/useAuth";
import Loader from '@/components/Loader/Loader';
import { useNavigate } from 'react-router-dom';

function MyOrders() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [sortBy, setSortBy] = useState('date-desc');

    const filterDropdownRef = useRef(null);
    const sortDropdownRef = useRef(null);
    const [openDropdownId, setOpenDropdownId] = useState(null);

    const fetchOrders = useCallback(async () => {
        if (!user?.id) return;


        setLoading(true);
        setError(null);
        try {
            const res = await getOrderFromUserId(user.id);
            console.log(res);
            if (res.success) {
                const normalized = res.data.map(o => ({
                    orderId: o.orderId,
                    customerName: o.customerName,
                    orderDate: o.orderDate,
                    orderStatus: o.orderStatus,
                    orderTotal: o.orderTotal,
                    cartItems: o.orderItems || [],
                }));
                setOrders(normalized);
            } else {
                setError('Failed to fetch orders. Please try again.');
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
                setOpenDropdownId(prev => prev === 'filter' ? null : prev);
            }
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setOpenDropdownId(prev => prev === 'sort' ? null : prev);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleViewDetails = (orderId) => {
        setSelectedOrderId(selectedOrderId === orderId ? null : orderId);
    };

    const toggleDropdown = (dropdownId) => {
        setOpenDropdownId(openDropdownId === dropdownId ? null : dropdownId);
    };

    const formatCurrency = (amount) => {
        return `$${parseFloat(amount).toFixed(2)}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            'PAID': '#007bff',
            'PENDING': '#ff9500',
            'PROCESSING': '#9c27b0',
            'SHIPPED': '#00c4ff',
            'DELIVERED': '#00b894',
            'CANCELED': '#ff4757'
        };
        return colors[status] || '#666';
    };

    const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    const filteredAndSortedOrders = orders
        .filter(order => statusFilter === 'All' || order.orderStatus === statusFilter)
        .sort((a, b) => {
            const dateA = new Date(a.orderDate);
            const dateB = new Date(b.orderDate);
            const totalA = parseFloat(a.orderTotal);
            const totalB = parseFloat(b.orderTotal);

            if (sortBy === 'date-asc') return dateA - dateB;
            if (sortBy === 'date-desc') return dateB - dateA;
            if (sortBy === 'total-asc') return totalA - totalB;
            if (sortBy === 'total-desc') return totalB - totalA;
            return dateB - dateA;
        });

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <h2>Error Loading Orders</h2>
                <p>{error}</p>
                <button className={styles.retryBtn} onClick={fetchOrders}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>My Orders</h1>
                {orders.length > 0 && (
                    <p className={styles.orderCount}>
                        {filteredAndSortedOrders.length} order{filteredAndSortedOrders.length !== 1 ? 's' : ''} found
                    </p>
                )}
            </div>

            {orders.length > 0 && (
                <div className={styles.controls}>
                    <div className={styles.filterGroup} ref={filterDropdownRef}>
                        <label>Filter by Status:</label>
                        <div className={styles.customDropdown}>
                            <button
                                className={`${styles.filterButton} ${openDropdownId === 'filter' ? styles.filterButtonActive : ''}`}
                                onClick={() => toggleDropdown('filter')}
                            >
                                <span className={styles.filterButtonText}>
                                    {statusFilter === 'All' ? 'All Statuses' : statusFilter}
                                </span>
                                <span className={`${styles.dropdownArrow} ${openDropdownId === 'filter' ? styles.dropdownArrowOpen : ''}`}>
                                    ▼
                                </span>
                            </button>

                            {openDropdownId === 'filter' && (
                                <div className={`${styles.dropdownMenu} ${styles.filterDropdownMenu}`}>
                                    <ul className={styles.dropdownList}>
                                        <li
                                            className={`${styles.dropdownItem} ${statusFilter === 'All' ? styles.dropdownItemActive : ''
                                                }`}
                                            onClick={() => {
                                                setStatusFilter('All');
                                                setOpenDropdownId(null);
                                            }}
                                        >
                                            All Statuses
                                        </li>
                                        {statusOptions.map(status => (
                                            <li
                                                key={status}
                                                className={`${styles.dropdownItem} ${status === statusFilter ? styles.dropdownItemActive : ''
                                                    }`}
                                                onClick={() => {
                                                    setStatusFilter(status);
                                                    setOpenDropdownId(null);
                                                }}
                                            >
                                                <span
                                                    className={styles.statusDot}
                                                    style={{ backgroundColor: getStatusColor(status) }}
                                                ></span>
                                                {status}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.sortGroup} ref={sortDropdownRef}>
                        <label>Sort by:</label>
                        <div className={styles.customDropdown}>
                            <button
                                className={`${styles.filterButton} ${openDropdownId === 'sort' ? styles.filterButtonActive : ''}`}
                                onClick={() => toggleDropdown('sort')}
                            >
                                <span className={styles.filterButtonText}>
                                    {sortBy === 'date-desc' ? 'Most Recent' :
                                        sortBy === 'date-asc' ? 'Oldest' :
                                            sortBy === 'total-desc' ? 'Highest Total' :
                                                'Lowest Total'}
                                </span>
                                <span className={`${styles.dropdownArrow} ${openDropdownId === 'sort' ? styles.dropdownArrowOpen : ''}`}>
                                    ▼
                                </span>
                            </button>

                            {openDropdownId === 'sort' && (
                                <div className={`${styles.dropdownMenu} ${styles.filterDropdownMenu}`}>
                                    <ul className={styles.dropdownList}>
                                        <li
                                            className={`${styles.dropdownItem} ${sortBy === 'date-desc' ? styles.dropdownItemActive : ''
                                                }`}
                                            onClick={() => {
                                                setSortBy('date-desc');
                                                setOpenDropdownId(null);
                                            }}
                                        >
                                            Most Recent
                                        </li>
                                        <li
                                            className={`${styles.dropdownItem} ${sortBy === 'date-asc' ? styles.dropdownItemActive : ''
                                                }`}
                                            onClick={() => {
                                                setSortBy('date-asc');
                                                setOpenDropdownId(null);
                                            }}
                                        >
                                            Oldest
                                        </li>
                                        <li
                                            className={`${styles.dropdownItem} ${sortBy === 'total-desc' ? styles.dropdownItemActive : ''
                                                }`}
                                            onClick={() => {
                                                setSortBy('total-desc');
                                                setOpenDropdownId(null);
                                            }}
                                        >
                                            Highest Total
                                        </li>
                                        <li
                                            className={`${styles.dropdownItem} ${sortBy === 'total-asc' ? styles.dropdownItemActive : ''
                                                }`}
                                            onClick={() => {
                                                setSortBy('total-asc');
                                                setOpenDropdownId(null);
                                            }}
                                        >
                                            Lowest Total
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        className={styles.refreshBtn}
                        onClick={fetchOrders}
                        disabled={loading}
                    >
                        Refresh Orders
                    </button>
                </div>
            )}

            {orders.length === 0 ? (
                <div className={styles.noOrders}>
                    <div className={styles.noOrdersIcon}>📦</div>
                    <h2>No Orders Yet</h2>
                    <p>Start shopping to see your orders here!</p>
                    <button className={styles.shopNowBtn}>
                        Start Shopping
                    </button>
                </div>
            ) : filteredAndSortedOrders.length === 0 ? (
                <div className={styles.noOrders}>
                    <h2>No orders match your filter</h2>
                    <p>Try changing your status filter to see more orders.</p>
                    <button
                        className={styles.clearFilterBtn}
                        onClick={() => setStatusFilter('All')}
                    >
                        Show All Orders
                    </button>
                </div>
            ) : (
                <div className={styles.ordersList}>
                    {filteredAndSortedOrders.map(order => (
                        <div key={order.orderId} className={styles.orderCard}>
                            <div className={styles.orderHeader}>
                                <div className={styles.orderHeaderLeft}>
                                    <h3 className={styles.orderTitle}>Order #{order.orderId}</h3>
                                    <div className={styles.orderInfoRow}>
                                        <span className={styles.orderDate}>{formatDate(order.orderDate)}</span>
                                        <span className={styles.orderSeparator}>•</span>
                                        <span
                                            className={styles.statusBadge}
                                            style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                                        >
                                            {order.orderStatus}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.orderHeaderRight}>
                                    <span className={styles.totalAmount}>
                                        {formatCurrency(order.orderTotal)}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.orderDetailsRow}>
                                <div className={styles.customerInfo}>
                                    <strong>Customer:</strong>
                                    <span>{order.customerName}</span>
                                </div>
                                <button
                                    className={styles.viewDetailsBtn}
                                    onClick={() => handleViewDetails(order.orderId)}
                                >
                                    {selectedOrderId === order.orderId ? 'Hide Details' : 'View Details'}
                                </button>
                            </div>

                            {selectedOrderId === order.orderId && (

                                <div className={styles.expandedDetails}>

                                    <div className={styles.productsList}>
                                        <div className={styles.listBody}>
                                            {order.cartItems?.map((item, index) => (
                                                <div key={item.id || item.productId} className={styles.listItem}>
                                                    <div className={styles.productInfo}>
                                                        <div className={styles.productIndex}>#{index + 1}</div>
                                                        <div className={styles.productDetails}>
                                                            <div className={styles.productName}>{item.productName || item.name}</div>

                                                        </div>
                                                    </div>

                                                    <div>
                                                        <button className={order.orderStatus === 'DELIVERED'
                                                            ? styles.writeReviewBtn
                                                            : styles.hideBtn}
                                                            onClick={() => navigate(`/addReview/${item.id}`)}>
                                                            <span>Review</span>
                                                        </button>
                                                    </div>

                                                    <div className={styles.itemMetrics}>
                                                        <div className={styles.metric}>
                                                            <div className={styles.metricValue}>{item.quantity}</div>
                                                            <div className={styles.metricLabel}>Qty</div>
                                                        </div>

                                                        <div className={styles.metric}>
                                                            <div className={styles.metricValue}>
                                                                ${(item.unitPrice || (item.price / item.quantity) || 0).toFixed(2)}
                                                            </div>
                                                            <div className={styles.metricLabel}>Unit Price</div>
                                                        </div>

                                                        <div className={styles.metric}>
                                                            <div className={styles.metricTotal}>
                                                                ${(item.price || item.subTotal || 0).toFixed(2)}
                                                            </div>
                                                            <div className={styles.metricLabel}>Total</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {(!order.cartItems || order.cartItems.length === 0) && (
                                                <div className={styles.emptyState}>
                                                    <div className={styles.emptyIcon}>📄</div>
                                                    <div className={styles.emptyText}>No products in this order</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className={styles.detailsGrid}>
                                        <div className={styles.detailItem}>
                                            <strong>Order ID:</strong>
                                            <span>{order.orderId}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <strong>Order Date:</strong>
                                            <span>{formatDate(order.orderDate)}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <strong>Customer Name:</strong>
                                            <span>{order.customerName}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <strong>Order Total:</strong>
                                            <span>{formatCurrency(order.orderTotal)}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <strong>Status:</strong>
                                            <span
                                                className={styles.detailStatus}
                                                style={{ color: getStatusColor(order.orderStatus) }}
                                            >
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )
            }
        </div >
    );
}

export default MyOrders;