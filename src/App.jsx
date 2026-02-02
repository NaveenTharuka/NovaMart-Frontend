import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout/Layout";

import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import AddProduct from "@/pages/AddProduct";
import UpdateProduct from "@/pages/UpdateProduct";
import UserPage from "@/pages/UserPage";
import OrderPage from "@/pages/OrderPage";

import Cart from "@/cart/Cart";
import AuthPage from "@/auth/AuthPage";

import { AuthProvider } from "@/auth/AuthContext";
import { CartProvider } from "@/cart/CartContext";
import ProtectedRoute from "@/auth/ProtectedRoute";

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
