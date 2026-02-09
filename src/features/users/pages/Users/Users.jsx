import { useEffect, useState, useMemo } from "react";
import { getAllUsers, updateUserRole } from "@/api/user.api";
import Loader from "@/components/Loader/Loader";
import styles from "./Users.module.css";

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [updatingUserId, setUpdatingUserId] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllUsers();
            if (!data) throw new Error("Failed to load users");
            setUsers(data);
        } catch (error) {
            console.error(error);
            setError(error.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    // Filter users based on search query
    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) return users;

        const query = searchQuery.toLowerCase();
        return users.filter(user =>
            user.name?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query) ||
            user.phoneNumber?.toLowerCase().includes(query) ||
            user.address?.toLowerCase().includes(query)
        );
    }, [users, searchQuery]);

    // Generate avatar color based on user name
    const getAvatarColor = (name) => {
        const colors = [
            'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
            'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        ];
        const index = (name?.charCodeAt(0) || 0) % colors.length;
        return colors[index];
    };

    // Get user initials
    const getInitials = (name) => {
        if (!name) return "?";
        const parts = name.trim().split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Handle role change
    const handleRoleChange = async (userId, currentRole, newRole) => {
        if (currentRole === newRole) return;

        try {
            setUpdatingUserId(userId);
            await updateUserRole(userId, newRole);

            alert("User role updated successfully");
            window.location.reload();

            // Update the local state
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId ? { ...user, role: newRole } : user
                )
            );
        } catch (error) {
            console.error("Failed to update user role:", error);
            alert("Failed to update user role. Please try again.");
        } finally {
            setUpdatingUserId(null);
        }
    };

    // Calculate statistics
    const totalUsers = users.length;
    const adminCount = users.filter(u => u.role === "ADMIN").length;
    const userCount = users.filter(u => u.role === "USER").length;
    const totalOrders = users.reduce((sum, user) => sum + (user.orderCount || 0), 0);

    if (loading) {
        return (
            <div className={styles.loaderContainer}>
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.container}>
                    <div className={styles.errorState}>
                        <div className={styles.errorIcon}>⚠️</div>
                        <h2 className={styles.errorTitle}>Oops! Something went wrong</h2>
                        <p className={styles.errorText}>{error}</p>
                        <button className={styles.retryButton} onClick={loadUsers}>
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.titleRow}>
                        <div className={styles.titleSection}>
                            <h1 className={styles.title}>User Management</h1>
                            <p className={styles.subtitle}>
                                Manage users and their roles
                            </p>
                        </div>

                        <div className={styles.statsBar}>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>{totalUsers}</span>
                                <span className={styles.statLabel}>Total Users</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>{adminCount}</span>
                                <span className={styles.statLabel}>Admins</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>{totalOrders}</span>
                                <span className={styles.statLabel}>Total Orders</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.searchContainer}>
                        <div className={styles.searchWrapper}>
                            <span className={styles.searchIcon}>🔍</span>
                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder="Search by name, email, phone, or address..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {filteredUsers.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyStateIcon}>
                            {searchQuery ? "🔍" : "👥"}
                        </div>
                        <h2 className={styles.emptyStateTitle}>
                            {searchQuery ? "No users found" : "No users yet"}
                        </h2>
                        <p className={styles.emptyStateText}>
                            {searchQuery
                                ? "Try adjusting your search criteria"
                                : "Users will appear here once they register"}
                        </p>
                    </div>
                ) : (
                    <div className={styles.usersContainer}>
                        <div className={styles.tableHeader}>
                            <div>Avatar</div>
                            <div>Name</div>
                            <div>Email</div>
                            <div>Phone</div>
                            <div>Address</div>
                            <div>Orders</div>
                            <div>Role</div>
                        </div>

                        {filteredUsers.map((user) => (
                            <div key={user.id} className={styles.userRow}>
                                <div className={styles.avatarCell}>
                                    <div
                                        className={styles.userAvatar}
                                        style={{ background: getAvatarColor(user.userName) }}
                                    >
                                        {getInitials(user.userName)}
                                    </div>
                                </div>

                                <div className={styles.nameCell} data-label="Name">
                                    <span className={styles.userName}>{user.userName}</span>
                                </div>

                                <div className={styles.emailCell} data-label="Email">
                                    {user.email}
                                </div>

                                <div className={styles.phoneCell} data-label="Phone">
                                    <span className={!user.phoneNumber ? styles.notProvided : ''}>
                                        {user.phoneNumber || "Not provided"}
                                    </span>
                                </div>

                                <div className={styles.addressCell} data-label="Address">
                                    <span className={!user.address ? styles.notProvided : ''}>
                                        {user.address || "Not provided"}
                                    </span>
                                </div>

                                <div className={styles.orderCell} data-label="Orders">
                                    <span className={styles.orderCount}>
                                        {user.orderCount || 0}
                                    </span>
                                </div>

                                <div className={styles.roleCell} data-label="Role">
                                    <select
                                        className={`${styles.roleSelector} ${user.role === 'ADMIN' ? styles.admin : styles.user}`}
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, user.role, e.target.value)}
                                        disabled={updatingUserId === user.id}
                                    >
                                        <option value="USER">User</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Users;