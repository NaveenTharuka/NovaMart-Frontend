import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Banner from "./components/banner.jsx";
import Navigation from "./components/navigation.jsx";
import Search from "./components/search.jsx";

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
                    <div className="top-0 left-0 w-full z-50 bg-white shadow-md">
                        <Banner />
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                            <Navigation />
                            <div className="ml-auto mr-4">
                                <Search />
                            </div>
                        </div>
                    </div>

                    <div className="main-content pt-32">
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

                        <footer className="footer">
                            <div className="footer-content">
                                <p className="footer-title">NovaMart</p>
                                <p className="footer-text">© 2025 Your E-Commerce Store. All rights reserved.</p>
                            </div>
                        </footer>
                    </div>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
