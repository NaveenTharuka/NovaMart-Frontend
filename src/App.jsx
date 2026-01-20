import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout"; // Import Layout component

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AddProduct from "./pages/AddProduct.jsx";
import UpdateProduct from "./pages/UpdateProduct.jsx";

import Cart from "./cart/Cart";
import AuthPage from "./auth/AuthPage";

import { AuthProvider } from "./auth/AuthContext";
import { CartProvider } from "./cart/CartContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import "./App.css";

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/products/:category" element={<Products />} />
                            <Route path="/product/:id" element={<ProductDetail />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/login" element={<AuthPage />} />

                            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                            <Route path="/addProduct" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
                            <Route path="/updateProduct/:id" element={<ProtectedRoute><UpdateProduct /></ProtectedRoute>} />
                        </Routes>
                    </Layout>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;