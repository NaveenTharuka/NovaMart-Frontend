import { useEffect, useState } from "react";
import ProductCard from "../components/productCard.jsx";
import { Link } from "react-router-dom";
import './Home.css';

function Home() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        // Fetch categories
        fetch("http://localhost:8080/api/categories")
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(e => console.log(e));

        // Fetch products
        fetch("http://localhost:8080/api/products")
            .then(res => res.json())
            .then(data => {
                setProducts(Array.isArray(data) ? data : data.products || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching products:", err);
                setLoading(false);
            });
    }, []);

    const featuredProducts = isMobile ? products.slice(0, 6) : products.slice(0, 5);

    return (
        <div className="home-page">
            <section className="home-hero">
                <h1 className="hero-title">Discover the Latest Products</h1>
                <p className="hero-subtitle">
                    Simple. Fast. Reliable Shopping. Handpicked products for you.
                </p>
                <Link to="/products">
                    <button className="hero-btn">
                        Explore Now
                    </button>
                </Link>
            </section>

            {/* Featured Products */}
            <section className="home-featured">
                <h2>Featured Products</h2>
                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Loading products...</p>
                    </div>
                ) : (
                    <div className="product-grid">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            {/* Categories */}
            {categories.length > 0 && (
                <section className="home-categories">
                    <h2>Shop by Category</h2>
                    <div className="category-list">
                        {categories.map(category => (
                            <Link
                                key={category.id}
                                to={`/products/${category.name.toLowerCase()}`}
                                className="category-item"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Call to Action */}
            <section className="home-cta">
                <h2>Special Offers!</h2>
                <p>Get 20% off on your first order. Use code: <span className="cta-code">NOVA20</span></p>
                <Link to="/products">
                    <button className="cta-btn">
                        Shop Now
                    </button>
                </Link>
            </section>
        </div>
    );
}

export default Home;
