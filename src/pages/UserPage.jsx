import "./UserPage.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../auth/UseAuth";

function UserPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="userpage-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="back-btn-container">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        ←
                    </button>
                </div>


                <h2>Admin Panel</h2>
                <ul className="menu">
                    <li onClick={() => navigate("/dashboard")}>Dashboard</li>
                    <li onClick={() => navigate("/products")}>Products</li>
                    <li onClick={() => navigate("/categories")}>Categories</li>
                    <li onClick={() => navigate("/orders")}>Orders</li>
                    <li onClick={() => navigate("/users")}>Users</li>
                </ul>

                <button className="logout-button" onClick={logout}>
                    Log Out
                </button>
            </aside>

            {/* Main content */}
            <main className="main-userpage-content">

                <h1>
                    Welcome, {user?.userName ? user.userName[0].toUpperCase() + user.userName.slice(1) : "Admin"}
                </h1>


                {/* Top Cards */}
                <div className="dashboard-cards">
                    <div className="card" onClick={() => navigate("/orders")}>
                        <h2>Orders</h2>
                        <p>View all orders</p>
                    </div>
                    <div className="card" onClick={() => navigate("/products")}>
                        <h2>All Products</h2>
                        <p>Manage all products</p>
                    </div>
                </div>

                {/* User Details */}
                <div className="user-details">
                    <h2>User Details</h2>
                    <div className="detail">
                        <span>Name:</span> <span>{user?.userName || "Admin"}</span>
                    </div>
                    <div className="detail">
                        <span>Email:</span> <span>{user?.email || "admin@example.com"}</span>
                    </div>
                    <div className="detail">
                        <span>Role:</span> <span>{user?.role || "Admin"}</span>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default UserPage;
