import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Banner from './components/banner.jsx';
import Navigation from './components/navigation.jsx';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import Search from './components/search.jsx';
import './App.css';

function App() {
  return (
    <Router>
      {/* Fixed Header */}
      <div className="top-0 left-0 w-full z-50 bg-white shadow-md">
        <Banner />
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
          <Navigation />
          <div className="ml-auto mr-4">
            <Search />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content pt-32">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:category" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <p className="footer-title">NovaMart</p>
            <p className="footer-text">
              © 2025 Your E-Commerce Store. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;