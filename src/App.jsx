import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout/Layout";

// Top-level pages
import Home from "@/pages/Home/Home";
import About from "@/pages/About/About";
import Contact from "@/pages/Contact/Contact";

// Product feature pages
import Products from "@/features/products/pages/Products/Products";
import ProductDetail from "@/features/products/pages/ProductDetail/ProductDetail";
import AddProduct from "@/features/products/pages/AddProduct/AddProduct";
import UpdateProduct from "@/features/products/pages/UpdateProduct/UpdateProduct";

// Order feature pages
import OrderPage from "@/features/orders/pages/OrderPage/OrderPage";
import OrderDetail from "@/features/orders/pages/OrderDetail/OrderDetailPage";
import MyOrders from "@/features/orders/pages/MyOrders/MyOrders";
import Orders from "@/features/orders/pages/AllOrders/AllOrders";

// User feature pages
import UserPage from "@/features/users/pages/UserPage/UserPage";
import Users from "@/features/users/pages/Users/Users";

// Cart feature
import Cart from "@/features/cart/components/Cart";

// Auth feature
import AuthPage from "@/features/auth/components/AuthPage";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import ProtectedRoute from "@/features/auth/routes/ProtectedRoute";

// Cart context
import { CartProvider } from "@/features/cart/context/CartContext";
import AddReview from "@/features/reviews/AddReview/addReview";
import "./App.css";

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/products/:category" element={<Products />} />
                            <Route path="/product/:id" element={<ProductDetail />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/login" element={<AuthPage />} />
                            <Route path="/orderpage/:id" element={<OrderPage />} />

                            <Route path="/addReview/:id" element={<ProtectedRoute><AddReview /></ProtectedRoute>} />
                            <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
                            <Route path="/myOrders/:id" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                            <Route path="/allOrders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                            <Route path="/userpage" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />
                            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                            <Route path="/addProduct" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
                            <Route path="/updateProduct/:id" element={<ProtectedRoute><UpdateProduct /></ProtectedRoute>} />
                        </Routes>
                    </Layout>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;

