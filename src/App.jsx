import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Banner from './components/banner.jsx';
import Navigation from './components/navigation.jsx';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <Router>
      {/* Fixed Header with your CSS classes */}
      <div className="-mb-30">
        <Banner />
        <Navigation />
      </div>

      {/* Main Content - Pushed down for fixed header */}
      <div className="main-content">
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