import React, { useState, useEffect, useRef } from 'react';
import styles from './AllOrders.module.css';
import { getAllOrders, updateOrderStatus, cancelOrder } from '@/api/order.api';
import Loader from '@/components/Loader/Loader';

const ExpandIcon = ({ expanded }) => (
    <svg className={`${styles.icon} ${expanded ? styles.iconExpanded : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {expanded ? (
            <path d="M18 15l-6-6-6 6" />
        ) : (
            <path d="M6 9l6 6 6-6" />
        )}
    </svg>
);

const EditIcon = () => (
    <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const SaveIcon = () => (
    <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1 2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
    </svg>
);

const CancelIcon = () => (
    <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const TrackIcon = () => (
    <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const PhoneIcon = () => (
    <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const LocationIcon = () => (
    <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const RefreshIcon = () => (
    <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M23 4v6h-6" />
        <path d="M1 20v-6h6" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
);

const ChevronDown = () => (
    <svg className={styles.chevron} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [editingStatus, setEditingStatus] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [cancellingOrder, setCancellingOrder] = useState(null);

    const statusDropdownRef = useRef(null);
    const dateDropdownRef = useRef(null);
    const sortDropdownRef = useRef(null);

    const statusOptions = [
        { value: 'all', label: 'All Statuses' },
        { value: 'PAID', label: 'Paid' },
        { value: 'PENDING', label: 'Pending' },
        { value: 'PROCESSING', label: 'Processing' },
        { value: 'SHIPPED', label: 'Shipped' },
        { value: 'DELIVERED', label: 'Delivered' },
        { value: 'CANCELED', label: 'Canceled' }
    ];

    const dateOptions = [
        { value: 'all', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'Last 7 Days' },
        { value: 'month', label: 'Last 30 Days' },
        { value: 'quarter', label: 'Last 3 Months' },
        { value: 'year', label: 'Last Year' }
    ];

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
        { value: 'amount_high', label: 'Amount (High to Low)' },
        { value: 'amount_low', label: 'Amount (Low to High)' }
    ];

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const ordersData = await getAllOrders();
            console.log('Raw API response:', ordersData.data);

            if (!Array.isArray(ordersData)) {
                throw new Error('Invalid orders data format. Expected an array.');
            }

            // Transform data to match your JSON structure
            const transformedOrders = ordersData.map(order => {
                // Calculate total items from orderItems array
                const totalItems = order.orderItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

                return {
                    // Use orderId from JSON
                    id: order.orderId,
                    orderId: order.orderId,

                    // Use orderDate from JSON
                    date: order.orderDate,

                    // Customer info from JSON
                    customer: order.customerName,
                    email: order.customerEmail,
                    phone: '+1 (555) 123-4567', // Not in your JSON

                    // Items and total
                    items: totalItems,
                    total: order.orderTotal || 0,

                    // Status from JSON - IMPORTANT: field is "orderStatus" not "status"
                    status: order.orderStatus || 'PENDING',

                    // Other fields
                    paymentMethod: 'Credit Card', // Not in your JSON
                    shippingAddress: order.shippingAddress || 'No address provided',

                    // Permissions
                    canCancel: (order.orderStatus === 'PENDING' || order.orderStatus === 'PROCESSING'),
                    canEditStatus: ['PENDING', 'PROCESSING', 'SHIPPED'].includes(order.orderStatus),

                    // Products from orderItems
                    products: order.orderItems?.map(item => ({
                        id: item.id,
                        name: item.productName,
                        quantity: item.quantity,
                        price: item.unitPrice,
                        totalPrice: item.price
                    })) || []
                };
            });

            setOrders(transformedOrders);
            setFilteredOrders(transformedOrders);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err.message || 'Failed to load orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
                setStatusDropdownOpen(false);
            }
            if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
                setDateDropdownOpen(false);
            }
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setSortDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        let result = [...orders];

        if (statusFilter !== 'all') {
            result = result.filter(order => order.status === statusFilter);
        }

        if (dateFilter !== 'all') {
            const now = new Date();
            const filterDate = new Date();

            switch (dateFilter) {
                case 'today': filterDate.setHours(0, 0, 0, 0); break;
                case 'week': filterDate.setDate(now.getDate() - 7); break;
                case 'month': filterDate.setMonth(now.getMonth() - 1); break;
                case 'quarter': filterDate.setMonth(now.getMonth() - 3); break;
                case 'year': filterDate.setFullYear(now.getFullYear() - 1); break;
            }

            result = result.filter(order => {
                const orderDate = new Date(order.date);
                return orderDate >= filterDate;
            });
        }

        result.sort((a, b) => {
            switch (sortBy) {
                case 'newest': return new Date(b.date) - new Date(a.date);
                case 'oldest': return new Date(a.date) - new Date(b.date);
                case 'amount_high': return parseFloat(b.total) - parseFloat(a.total);
                case 'amount_low': return parseFloat(a.total) - parseFloat(b.total);
                default: return 0;
            }
        });

        setFilteredOrders(result);
    }, [orders, statusFilter, dateFilter, sortBy]);

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

    const getStatusLabel = (status) => {
        return statusOptions.find(opt => opt.value === status)?.label || status;
    };

    const formatDate = (dateString) => {
        try {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid date';
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Error formatting date:', dateString, error);
            return 'Invalid date';
        }
    };

    const formatCurrency = (amount) => {
        const num = parseFloat(amount);
        if (isNaN(num)) return '$0.00';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(num);
    };

    const handleUpdateStatus = async (orderId) => {
        if (!newStatus) {
            alert('Please select a status');
            return;
        }

        setUpdatingStatus(true);
        try {
            const result = await updateOrderStatus(orderId, newStatus);

            if (result.success) {
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.orderId === orderId ? {
                            ...order,
                            status: newStatus,
                            canCancel: newStatus !== 'CANCELED',
                            canEditStatus: !['DELIVERED', 'CANCELED'].includes(newStatus)
                        } : order
                    )
                );
                setEditingStatus(null);
                setNewStatus('');
                alert('Order status updated successfully!');
            } else {
                throw new Error(result.error || 'Failed to update status');
            }
        } catch (err) {
            console.error('Error updating order status:', err);
            alert(`Failed to update order status: ${err.message}`);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
            return;
        }

        setCancellingOrder(orderId);
        try {
            const result = await cancelOrder(orderId);

            if (result.success) {
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.orderId === orderId ? {
                            ...order,
                            status: 'CANCELED',
                            canCancel: false,
                            canEditStatus: false
                        } : order
                    )
                );
                alert('Order cancelled successfully.');
            } else {
                throw new Error(result.error || 'Failed to cancel order');
            }
        } catch (err) {
            console.error('Error cancelling order:', err);
            alert(`Failed to cancel order: ${err.message}`);
        } finally {
            setCancellingOrder(null);
        }
    };

    const CustomDropdown = ({ label, value, options, isOpen, onToggle, onChange, innerRef }) => {
        const selectedOption = options.find(opt => opt.value === value) || options[0];

        return (
            <div className={styles.customDropdown} ref={innerRef}>
                <label className={styles.dropdownLabel}>{label}</label>
                <div className={styles.dropdownContainer}>
                    <button
                        className={`${styles.dropdownButton} ${isOpen ? styles.dropdownButtonActive : ''}`}
                        onClick={onToggle}
                    >
                        <span className={styles.dropdownButtonText}>{selectedOption.label}</span>
                        <ChevronDown />
                    </button>

                    {isOpen && (
                        <div className={styles.dropdownMenu}>
                            <div className={styles.dropdownMenuContent}>
                                <ul className={styles.dropdownList}>
                                    {options.map((option) => (
                                        <li
                                            key={option.value}
                                            className={`${styles.dropdownListItem} ${value === option.value ? styles.dropdownListItemActive : ''}`}
                                            onClick={() => {
                                                onChange(option.value);
                                                onToggle();
                                            }}
                                        >
                                            {option.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const toggleOrderDetails = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingContainer}>
                    <Loader />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.errorContainer}>
                    <h2>Error Loading Orders</h2>
                    <p>{error}</p>
                    <button className={styles.retryBtn} onClick={fetchOrders}>
                        <RefreshIcon />
                        <span>Retry</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>All Orders</h1>
                <p className={styles.orderCount}>
                    {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
                </p>
            </div>

            <div className={styles.controls}>
                <CustomDropdown
                    label="Filter by Status"
                    value={statusFilter}
                    options={statusOptions}
                    isOpen={statusDropdownOpen}
                    onToggle={() => setStatusDropdownOpen(!statusDropdownOpen)}
                    onChange={setStatusFilter}
                    innerRef={statusDropdownRef}
                />

                <CustomDropdown
                    label="Filter by Date"
                    value={dateFilter}
                    options={dateOptions}
                    isOpen={dateDropdownOpen}
                    onToggle={() => setDateDropdownOpen(!dateDropdownOpen)}
                    onChange={setDateFilter}
                    innerRef={dateDropdownRef}
                />

                <CustomDropdown
                    label="Sort by"
                    value={sortBy}
                    options={sortOptions}
                    isOpen={sortDropdownOpen}
                    onToggle={() => setSortDropdownOpen(!sortDropdownOpen)}
                    onChange={setSortBy}
                    innerRef={sortDropdownRef}
                />

                {(statusFilter !== 'all' || dateFilter !== 'all' || sortBy !== 'newest') && (
                    <button
                        className={styles.clearFilterBtn}
                        onClick={() => {
                            setStatusFilter('all');
                            setDateFilter('all');
                            setSortBy('newest');
                        }}
                    >
                        <CancelIcon />
                        <span>Clear Filters</span>
                    </button>
                )}

                <button
                    className={styles.refreshBtn}
                    onClick={fetchOrders}
                    disabled={loading}
                >
                    <RefreshIcon />
                    <span>{loading ? 'Refreshing...' : 'Refresh Orders'}</span>
                </button>
            </div>

            {filteredOrders.length === 0 ? (
                <div className={styles.noOrders}>
                    <div className={styles.noOrdersIcon}>📦</div>
                    <h2>No orders found</h2>
                    <p>
                        {statusFilter !== 'all' || dateFilter !== 'all'
                            ? 'Try changing your filters to see more orders.'
                            : 'You haven\'t placed any orders yet.'}
                    </p>
                    {statusFilter !== 'all' || dateFilter !== 'all' ? (
                        <button
                            className={styles.clearFilterBtn}
                            onClick={() => {
                                setStatusFilter('all');
                                setDateFilter('all');
                                setSortBy('newest');
                            }}
                        >
                            <CancelIcon />
                            <span>Clear All Filters</span>
                        </button>
                    ) : (
                        <button
                            className={styles.shopNowBtn}
                            onClick={() => window.location.href = '/shop'}
                        >
                            <span>Start Shopping</span>
                        </button>
                    )}
                </div>
            ) : (
                <div className={styles.ordersTable}>
                    <div className={styles.tableHeader}>
                        <div className={styles.tableRow}>
                            <div className={styles.colOrderId}>Order ID</div>
                            <div className={styles.colDate}>Date</div>
                            <div className={styles.colCustomer}>Customer</div>
                            <div className={styles.colItems}>Items</div>
                            <div className={styles.colTotal}>Total</div>
                            <div className={styles.colStatus}>Status</div>
                            <div className={styles.colActions}>Actions</div>
                        </div>
                    </div>

                    <div className={styles.tableBody}>
                        {filteredOrders.map(order => {
                            const statusColor = getStatusColor(order.status);
                            const statusLabel = getStatusLabel(order.status);
                            const isExpanded = expandedOrder === order.id;

                            return (
                                <div key={order.id} className={styles.orderRow}>
                                    <div className={`${styles.tableRow} ${styles.mainRow}`}>
                                        <div className={styles.colOrderId}>
                                            <span className={styles.orderIdText}>{order.orderId}</span>
                                        </div>
                                        <div className={styles.colDate}>
                                            {formatDate(order.date)}
                                        </div>
                                        <div className={styles.colCustomer}>
                                            <div className={styles.customerInfo}>
                                                <span className={styles.customerName}>{order.customer}</span>
                                                <span className={styles.customerEmail}>{order.email}</span>
                                            </div>
                                        </div>
                                        <div className={styles.colItems}>
                                            {order.items} item{order.items !== 1 ? 's' : ''}
                                        </div>
                                        <div className={styles.colTotal}>
                                            {formatCurrency(order.total)}
                                        </div>
                                        <div className={styles.colStatus}>
                                            <span
                                                className={styles.statusBadge}
                                                style={{ backgroundColor: statusColor }}
                                            >
                                                {statusLabel}
                                            </span>
                                        </div>
                                        <div className={styles.colActions}>
                                            <button
                                                className={styles.viewDetailsBtn}
                                                onClick={() => toggleOrderDetails(order.id)}
                                            >
                                                <ExpandIcon expanded={isExpanded} />
                                                <span>{isExpanded ? 'Hide' : 'View'}</span>
                                            </button>
                                            {order.canCancel && (
                                                <button
                                                    className={styles.cancelBtn}
                                                    onClick={() => handleCancelOrder(order.orderId)}
                                                    disabled={cancellingOrder === order.orderId}
                                                >
                                                    <CancelIcon />
                                                    <span>{cancellingOrder === order.orderId ? 'Cancelling...' : 'Cancel'}</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className={styles.expandedRow}>
                                            <div className={styles.expandedContent}>
                                                <div className={styles.expandedLeft}>
                                                    <div className={styles.detailsSection}>
                                                        <h4>Order Details</h4>
                                                        <div className={styles.detailItem}>
                                                            <span className={styles.detailLabel}>Order ID:</span>
                                                            <span className={styles.detailValue}>{order.orderId}</span>
                                                        </div>
                                                        <div className={styles.detailItem}>
                                                            <span className={styles.detailLabel}>Order Date:</span>
                                                            <span className={styles.detailValue}>{formatDate(order.date)}</span>
                                                        </div>
                                                        <div className={styles.detailItem}>
                                                            <span className={styles.detailLabel}>Status:</span>
                                                            <span
                                                                className={styles.detailValue}
                                                                style={{ color: statusColor }}
                                                            >
                                                                {statusLabel}
                                                            </span>
                                                        </div>
                                                        <div className={styles.detailItem}>
                                                            <span className={styles.detailLabel}>Payment Method:</span>
                                                            <span className={styles.detailValue}>{order.paymentMethod}</span>
                                                        </div>
                                                    </div>

                                                    <div className={styles.detailsSection}>
                                                        <h4>Contact Information</h4>
                                                        <div className={styles.detailItem}>
                                                            <PhoneIcon />
                                                            <span className={styles.detailLabel}>Phone:</span>
                                                            <span className={styles.detailValue}>{order.phone}</span>
                                                        </div>
                                                        <div className={styles.detailItem}>
                                                            <span className={styles.detailLabel}>Email:</span>
                                                            <span className={styles.detailValue}>{order.email}</span>
                                                        </div>
                                                    </div>

                                                    <div className={styles.detailsSection}>
                                                        <h4>Shipping Address</h4>
                                                        <div className={styles.detailItem}>
                                                            <LocationIcon />
                                                            <span className={styles.detailValue}>{order.shippingAddress}</span>
                                                        </div>
                                                    </div>

                                                    {order.canEditStatus && editingStatus === order.id ? (
                                                        <div className={styles.statusEditSection}>
                                                            <h4>Update Status</h4>
                                                            <div className={styles.statusSelectRow}>
                                                                <select
                                                                    value={newStatus}
                                                                    onChange={(e) => setNewStatus(e.target.value)}
                                                                    className={styles.statusSelect}
                                                                >
                                                                    <option value="">Select Status</option>
                                                                    {statusOptions
                                                                        .filter(opt =>
                                                                            !['all', 'CANCELED'].includes(opt.value) &&
                                                                            opt.value !== order.status
                                                                        )
                                                                        .map(option => (
                                                                            <option key={option.value} value={option.value}>
                                                                                {option.label}
                                                                            </option>
                                                                        ))}
                                                                </select>
                                                                <div className={styles.statusEditActions}>
                                                                    <button
                                                                        onClick={() => handleUpdateStatus(order.orderId)}
                                                                        disabled={updatingStatus || !newStatus}
                                                                        className={styles.saveStatusBtn}
                                                                    >
                                                                        <SaveIcon />
                                                                        <span>{updatingStatus ? 'Updating...' : 'Save'}</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            setEditingStatus(null);
                                                                            setNewStatus('');
                                                                        }}
                                                                        disabled={updatingStatus}
                                                                        className={styles.cancelStatusBtn}
                                                                    >
                                                                        <CancelIcon />
                                                                        <span>Cancel</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : order.canEditStatus && (
                                                        <div className={styles.statusEditSection}>
                                                            <button
                                                                onClick={() => {
                                                                    setEditingStatus(order.id);
                                                                    setNewStatus(order.status);
                                                                }}
                                                                className={styles.editStatusBtn}
                                                            >
                                                                <EditIcon />
                                                                <span>Edit Status</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className={styles.expandedRight}>
                                                    <div className={styles.itemsSection}>
                                                        <h4>Order Items ({order.items})</h4>
                                                        <div className={styles.itemsList}>
                                                            {order.products.map((product, index) => (
                                                                <div key={index} className={styles.itemRow}>
                                                                    <div className={styles.itemInfo}>
                                                                        <div className={styles.itemName}>{product.name}</div>
                                                                        <div className={styles.itemDetails}>
                                                                            <span className={styles.itemQuantity}>
                                                                                Quantity: {product.quantity}
                                                                            </span>
                                                                            <span className={styles.itemPrice}>
                                                                                Price: {formatCurrency(product.price)} each
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className={styles.itemTotal}>
                                                                        {formatCurrency(product.totalPrice || product.price * product.quantity)}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className={styles.orderTotal}>
                                                            <div className={styles.totalRow}>
                                                                <span className={styles.totalLabel}>Order Total:</span>
                                                                <span className={styles.totalAmount}>{formatCurrency(order.total)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;