import { useNavigate } from "react-router-dom";
import useAuth from "../../../auth/hooks/useAuth"
import styles from "./UserPage.module.css";

function UserPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className={styles.userpageContainer}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.backBtnContainer}>
                    <button className={styles.backButton} onClick={() => navigate(-1)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                <h2 className={styles.title}>Admin Panel</h2>

                <ul className={styles.menu}>
                    <li className={styles.menuItem} onClick={() => navigate("/userpage")}>
                        <span>📊</span> Dashboard
                    </li>

                    {user.role === "ADMIN" && (
                        <li className={styles.menuItem} onClick={() => navigate("/products")}>
                            <span>🛍️</span> Products
                        </li>
                    )}
                    {user.role === "ADMIN" && (
                        <li className={styles.menuItem} onClick={() => navigate("/userpage")}>
                            <span>📂</span> Categories
                        </li>
                    )}
                    {user.role === "ADMIN" && (
                        <li className={styles.menuItem} onClick={() => navigate("/allOrders")}>
                            <span>📦</span> Orders
                        </li>
                    )}

                    {user.role === "ADMIN" && (
                        <li className={styles.menuItem} onClick={() => navigate("/users")}>
                            <span>👥</span> Users
                        </li>
                    )}

                    <li className={styles.menuItem} onClick={() => navigate(`/myOrders/${user.id}`)}>
                        <span>🙋‍♂️</span>My Orders
                    </li>


                    {/* Logout for mobile menu flow (visible via CSS on mobile if desired, or duplicate) */}
                    <li className={`${styles.menuItem} ${styles.mobileLogout}`} onClick={logout}>
                        <span>🚪</span> Logout
                    </li>
                </ul>

                <button className={styles.logoutButton} onClick={logout}>
                    Log Out
                </button>
            </aside>

            {/* Main content */}
            <main className={styles.mainContent}>
                <h1 className={styles.welcomeTitle}>
                    Welcome, {user?.userName ? user.userName[0].toUpperCase() + user.userName.slice(1) : "Admin"} 👋
                </h1>

                {/* Top Cards */}
                <div className={styles.dashboardCards}>
                    <div
                        className={styles.card}
                        onClick={() => navigate("/allOrders")}
                        style={{ animationDelay: '0.1s' }}
                    >
                        <h2>Orders</h2>
                        <p>View and manage customer orders</p>
                    </div>
                    <div
                        className={styles.card}
                        onClick={() => navigate("/products")}
                        style={{ animationDelay: '0.2s' }}
                    >
                        <h2>Products</h2>
                        <p>Manage inventory and new arrivals</p>
                    </div>
                    <div
                        className={styles.card}
                        onClick={() => navigate("/users")}
                        style={{ animationDelay: '0.3s' }}
                    >
                        <h2>Users</h2>
                        <p>Manage registered customers</p>
                    </div>
                </div>

                {/* User Details */}
                <div className={styles.userDetails}>
                    <h2 className={styles.sectionTitle}>User Details</h2>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Name</span>
                        <span className={styles.detailValue}>{user?.userName || "Admin"}</span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Email</span>
                        <span className={styles.detailValue}>{user?.email || "admin@example.com"}</span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Role</span>
                        <span className={styles.detailValue}>{user?.role || "Admin"}</span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Status</span>
                        <span className={styles.detailValue} style={{ color: '#10b981' }}>Active</span>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default UserPage;
